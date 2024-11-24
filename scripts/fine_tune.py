import os
from openai import OpenAI

# Set your OpenAI API key


# Define the path to your dataset file
file_path = r"C:\Users\antho\Downloads\project3\project-3-team-9b\data\chatbot_data.jsonl"  # Absolute path

# Check if the file exists
if not os.path.exists(file_path):
    print(f"Error: The file at {file_path} does not exist.")
else:
    try:
        # Step 1: Upload the file for fine-tuning
        file_response = client.files.create(file=open(file_path, "rb"), purpose='fine-tune')

        print("File uploaded successfully:", file_response)

        # Step 2: Start fine-tuning job using the correct method
        fine_tune_response = client.fine_tuning.jobs.create(
            training_file=file_response.id,  # Use the file ID from the upload response
            model="gpt-3.5-turbo-0125"  # Choose the model you want to fine-tune
        )

        print("Fine-tuning started successfully:", fine_tune_response)

    except Exception as e:
        print(f"An error occurred: {e}")
