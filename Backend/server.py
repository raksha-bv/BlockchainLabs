from flask import Flask,request,jsonify
from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key = os.getenv("API_KEY"))

app = Flask(__name__)

@app.route('/', methods=['GET'])
def connect():
    print('Connected to the server')
    return 'Connected to the server'


@app.route('/generatePS', methods=['GET'])
def generatePS():
    """Generate a problem statement"""
    prompt = """Generate a smart contract problem statement for a beginner learning solidiy

    Format The Problem Statement as follows :
        1. Title : Short Title of the Problem Statement
        2. Description : Description of the Problem Statement
        3. Requirements : Requirements of the Problem Statement
        4. Hints : Hints for the Problem Statement
    
        Make the thing as a json object.
    """
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt
        )
        
        text_response = response.candidates[0].content.parts[0].text
        
        # Clean up the response to extract only the JSON part
        if '```json' in text_response:
            # Extract text between ```json and the next ```
            start_index = text_response.find('```json') + 7
            end_index = text_response.find('```', start_index)
            if end_index != -1:
                text_response = text_response[start_index:end_index].strip()
            else:
                # If no ending ``` is found, just remove the start
                text_response = text_response[start_index:].strip()
        
        # Parse the JSON
        json_response = json.loads(text_response)
        return jsonify(json_response)
    except Exception as e:
        print(f"Error processing response: {str(e)}")
        print(f"Raw response text: {text_response}")
        # Return both the error and the text for debugging
        return jsonify({
            'Error': str(e),
            'raw_text': text_response
        }),

@app.route('/generatePSI', methods =['GET'])
def generatePSI():
    """Generate a problem statement"""
    prompt = """Generate a smart contract problem statement for a Intermediate learning solidiy

    Format The Problem Statement as follows :
        1. Title : Short Title of the Problem Statement
        2. Description : Description of the Problem Statement
        3. Requirements : Requirements of the Problem Statement
        4. Hints : Hints for the Problem Statement
    
        Make the thing as a json object.
    """
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt
        )
        
        text_response = response.candidates[0].content.parts[0].text
        
        # Clean up the response to extract only the JSON part
        if '```json' in text_response:
            # Extract text between ```json and the next ```
            start_index = text_response.find('```json') + 7
            end_index = text_response.find('```', start_index)
            if end_index != -1:
                text_response = text_response[start_index:end_index].strip()
            else:
                # If no ending ``` is found, just remove the start
                text_response = text_response[start_index:].strip()
        
        # Parse the JSON
        json_response = json.loads(text_response)
        return jsonify(json_response)
    except Exception as e:
        print(f"Error processing response: {str(e)}")
        print(f"Raw response text: {text_response}")
        # Return both the error and the text for debugging
        return jsonify({
            'Error': str(e),
            'raw_text': text_response
        }),

@app.route('/generatePSA', methods =['GET'])
def generatePSA():
    """Generate a problem statement"""
    prompt = """Generate a smart contract problem statement for a Advanced learning solidiy

    Format The Problem Statement as follows :
        1. Title : Short Title of the Problem Statement
        2. Description : Description of the Problem Statement
        3. Requirements : Requirements of the Problem Statement
        4. Hints : Hints for the Problem Statement
    
        Make the thing as a json object.
    """
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt
        )
        
        text_response = response.candidates[0].content.parts[0].text
        
        # Clean up the response to extract only the JSON part
        if '```json' in text_response:
            # Extract text between ```json and the next ```
            start_index = text_response.find('```json') + 7
            end_index = text_response.find('```', start_index)
            if end_index != -1:
                text_response = text_response[start_index:end_index].strip()
            else:
                # If no ending ``` is found, just remove the start
                text_response = text_response[start_index:].strip()
        
        # Parse the JSON
        json_response = json.loads(text_response)
        return jsonify(json_response)
    except Exception as e:
        print(f"Error processing response: {str(e)}")
        print(f"Raw response text: {text_response}")
        # Return both the error and the text for debugging
        return jsonify({
            'Error': str(e),
            'raw_text': text_response
        }),
@app.route('/validate-code', methods=['POST'])
def validate_code():
    """Validate the code against the problem statement"""
    data = request.get_json()
    problem_statement = data['problem_statement']
    code = data['code']
    prompt = """Validate the code against the problem statement
        1.Check if every word in the code is correct as in the keywords match the syntax of solidity
        2.Check if the brackets,semicolons are correctly placed
        3.Check if the code will compile successfully
        4.Check if the code is written in Solidity - neccessary Requirement
        5.Recheck the entire code for syntax errors or compilation errors it might give
        6.Recheck for the brackets,semicolons being correctly placed
        
        respond with a json object as this:
        {
            "status" : True or False,
            "syntax_correct" : True or False - Check every keyword if its correct,
            "compilable_code" (Code Will Compile or Not) : True or False,
            "error" : "error message"
        }
    """
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents = "problem statement : " + problem_statement + "\n" + " code : " + code + "\n" + prompt
        )
        
        text_response = response.candidates[0].content.parts[0].text
        
        # Clean up the response to extract only the JSON part
        if '```json' in text_response:
            # Extract text between ```json and the next ```
            start_index = text_response.find('```json') + 7
            end_index = text_response.find('```', start_index)
            if end_index != -1:
                text_response = text_response[start_index:end_index].strip()
            else:
                # If no ending ``` is found, just remove the start
                text_response = text_response[start_index:].strip()
        
        # Parse the JSON
        json_response = json.loads(text_response)
        return jsonify(json_response)
    except Exception as e:
        print(f"Error processing response: {str(e)}")
        text_response = "Error occurred before response was received" # Add this line
        print(f"Raw response text: {text_response}")
        # Return both the error and the text for debugging
        return jsonify({
            'Error': str(e),
            'raw_text': text_response
        })



if __name__ == '__main__':
    app.run(port=3000,debug=True)