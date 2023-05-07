import os
import argparse
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import InstalledAppFlow
from termcolor import colored

def get_message_ids(service, query, user_id):
    try:
        message_ids = []

        # Retrieve the first page of messages
        response = service.users().messages().list(userId=user_id, q=query).execute()
        messages = response.get('messages', [])
        message_ids += [m['id'] for m in messages]

        # Keep retrieving pages until all messages have been retrieved
        while 'nextPageToken' in response:
            page_token = response['nextPageToken']
            response = service.users().messages().list(userId=user_id, q=query, pageToken=page_token).execute()
            messages = response.get('messages', [])
            message_ids += [m['id'] for m in messages]

        print(f'{len(message_ids)} messages retrieved.')

        return message_ids

    except HttpError as error:
        print('An error occurred: %s' % error)
        return []

def bulk_delete(service, message_ids, query, user_id):
    try:
        # Batch delete the messages
        batch = service.new_batch_http_request()
        for message_id in message_ids:
            batch.add(service.users().messages().delete(userId='me', id=message_id))
        batch.execute()

        numDeleted = len(message_ids)
        if numDeleted > 1:
            print(f'{numDeleted} messages successfully deleted for email id {user_id} and search query {query}')
        else:
            print(f'{numDeleted} message successfully deleted for email id {user_id} and search query {query}')

    except HttpError as error:
        print('An error occurred: %s' % error)

def main(user_id, search_query):
    # Confirm the search query with the user
    #confirmation = input(f"Are you sure you want to delete all messages matching the search query '{colored(search_query, 'red')}'? (y/n) ")
    #if confirmation.lower() != 'y':
    #    print('Deletion cancelled.')
    #    return
    
    CLIENT_SECRET_FILE = '/Users/basu/client_secret_90908281168-u3tudf2d1hsi6lq7rtt5dmtl8chspkau.apps.googleusercontent.com.json'
    SCOPES = ['https://mail.google.com/']

    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
    creds = flow.run_local_server(port=0)

    # Create the Gmail API service object
    service = build('gmail', 'v1', credentials=creds)

    # Get the message IDs that match the query
    message_ids = get_message_ids(service, search_query, user_id)

    print('Output: ');

    # Bulk delete the messages
    bulk_delete(service, message_ids, search_query, user_id)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Bulk delete Gmails')
    parser.add_argument('username', type=str, help='Gmail username')
    parser.add_argument('query', type=str, help='Query for selecting messages to delete')
    args = parser.parse_args()

    # Check that there are exactly two command-line arguments
    if len(vars(args)) != 2:
        parser.print_help()
        exit()

    main(args.username, args.query)
