import os
from azure.cosmos import CosmosClient
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
import time
import pytz
import logging
from dateutil.parser import parse  # 追加

# ログ設定
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# 定数
COSMOS_DB_ENDPOINT = os.getenv('COSMOS_DB_ENDPOINT')
COSMOS_DB_KEY = os.getenv('COSMOS_DB_KEY')
DATABASE_ID = 'ToDoApp'
CONTAINER_ID = 'ToDo'
JST = pytz.timezone('Asia/Tokyo')

# CosmosDBクライアントのセットアップ
client = CosmosClient(COSMOS_DB_ENDPOINT, COSMOS_DB_KEY)
database = client.get_database_client(DATABASE_ID)
container = database.get_container_client(CONTAINER_ID)

def get_todos():
    """CosmosDBからToDoタスクを取得"""
    try:
        query = "SELECT * FROM c"
        todos = list(container.query_items(query=query, enable_cross_partition_query=True))
        logging.info(f"{len(todos)} tasks retrieved from CosmosDB.")
        return todos
    except Exception as e:
        logging.error(f"Failed to retrieve tasks: {e}")
        return []

def send_email(subject, body):
    """メールを送信"""
    try:
        sender_email = os.getenv('SENDER_EMAIL')
        sender_password = os.getenv('EMAIL_PASSWORD')
        recipient_email = os.getenv('RECIPIENT_EMAIL')

        if not all([sender_email, sender_password, recipient_email]):
            logging.error("Email credentials or recipient email are not set.")
            return

        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = recipient_email

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, msg.as_string())
        logging.info(f"Email sent: {subject}")
    except smtplib.SMTPAuthenticationError as e:
        logging.error(f"Failed to send email due to authentication error: {e}. "
                      "Ensure you are using an application-specific password. "
                      "Refer to https://support.google.com/mail/?p=InvalidSecondFactor for more details.")
    except Exception as e:
        logging.error(f"Failed to send email: {e}")

def create_email_body(tasks, task_type):
    """メール本文を作成"""
    task_list = "\n".join([f"- {task['title']} (Due: {task['dueDate']})" for task in tasks])
    return f"{task_type}:\n{task_list}" if tasks else ""

def notify_due_tasks():
    """期限に応じてタスクを通知"""
    todos = get_todos()
    today = datetime.now(JST).date()
    tomorrow = today + timedelta(days=1)

    today_tasks = [todo for todo in todos if parse(todo['dueDate']).date() == today]
    tomorrow_tasks = [todo for todo in todos if parse(todo['dueDate']).date() == tomorrow]
    expired_tasks = [todo for todo in todos if parse(todo['dueDate']).date() < today]

    if today_tasks:
        body = create_email_body(today_tasks, "Tasks due today")
        send_email("Today's Tasks", body)
    if tomorrow_tasks:
        body = create_email_body(tomorrow_tasks, "Tasks due tomorrow")
        send_email("Tomorrow's Tasks", body)
    if expired_tasks:
        body = create_email_body(expired_tasks, "Tasks that are overdue")
        send_email("Expired Tasks", body)

def main():
    logging.info("Notification service started.")
    try:
        notify_due_tasks()  # 起動時に一度だけ通知を実行
        logging.info("Notification task completed.")
    except Exception as e:
        logging.error(f"An error occurred during notification execution: {e}")

if __name__ == "__main__":
    main()