from openai import OpenAI
import os
import time
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Access API key from .env
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("Error: OPENAI_API_KEY not found in .env file.")
    exit()

client = OpenAI(api_key=api_key)

# Path to your dataset
dataset_path = "C:\\Users\\antho\\Downloads\\project3\\project-3-team-9b\\datasets\\dataset_prepared.jsonl"

# Step 1: Upload the file
print("Uploading file...")
try:
    with open(dataset_path, "rb") as file:
        response = client.files.create(file=file, purpose="fine-tune")
        file_id = response.id
    print("File uploaded successfully!")
    print(f"File ID: {file_id}")
except Exception as e:
    print(f"Error during file upload: {e}")
    exit()

# Step 2: Start fine-tuning
print("Starting fine-tuning...")
try:
    fine_tune_response = client.fine_tuning.jobs.create(training_file=file_id, model="gpt-3.5-turbo-1106")
    fine_tune_id = fine_tune_response.id
    print(f"Fine-tuning job started successfully: {fine_tune_id}")
except Exception as e:
    print(f"Error during fine-tuning creation: {e}")
    exit()

# Step 3: Monitor the fine-tuning process
print("Monitoring fine-tuning job...")
try:
    while True:
        fine_tune_status = client.fine_tuning.jobs.retrieve(fine_tune_id)
        status = fine_tune_status.status
        print(f"Status: {status}")

        if status == "succeeded":
            print("Fine-tuning completed successfully!")
            print(f"Fine-tuned model ID: {fine_tune_status.fine_tuned_model}")
            break
        elif status == "failed":
            print("Fine-tuning failed.")
            break

        time.sleep(30)  # Wait 30 seconds before checking again
except Exception as e:
    print(f"Error while monitoring fine-tuning: {e}")
    exit()
