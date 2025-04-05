import google.generativeai as genai
import random

import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from dotenv import load_dotenv
load_dotenv()

from api.habits.habit_service import HabitService


class AssistantService:
    """
    Service module for handling Gemini Assistant logic
    """
    _is_configured = False  # Class-level flag to track configuration

    def __init__(self, 
                 api_key: str = os.getenv("GEMINI_API_KEY"), 
                 sys_prompt: str = None, 
                 model_name: str = "gemini-1.5-flash"
        ):
        self.api_key = api_key
        self.model_name = model_name
        self.sys_prompt = sys_prompt or "You sing"

        
        # Configure genai only once
        if not AssistantService._is_configured:
            genai.configure(api_key=api_key)
            AssistantService._is_configured = True

        self.model = genai.GenerativeModel(model_name)

    def chat(self, data:dict) -> str:
        """
        Sends a request to Google Gemini and returns a response from the LLM
        Args:
            data (dict): user_id and habit_id sent from the frontend
        Returns:
            str: A html formatted response from Gemini
        """
        sys_prompts = """
            You are a task completion and scheduling assistant helping users plan and schedule their tasks for the day.
            You will be provided a list of tasks and the duration how long the task has to be performed(in minutes).
            You have to keep in mind human physical and mental limitations.
            You have to account for practicality and feasibility of the task.
            Do not ask any questions in the response.
            Assume the person goes to sleep at 22:00 and wakes up at 06:00.
            Give a JSON Response where the keys are the tasks and values are 2 element array.
            First Element of the array is the beginning time and the second element is the finishing time.
            Schedule tasks in the most optimal order.
            You will be given an "Intensity" parameter where intensity can be very high, high, mid, low and very low.
            Lower intensity means there can be larger and more frequent breaks between tasks.
            Higher in tensity means shorter and less frequent breaks.
            Do not add (```json) at the beginning and the end.
            Remove any symbols like ```json
            The response should be pure json response beginning with { and ending with } having only key value pairs strictly


            """

        # Retreive user id and habit id to create prompt
        habit_id = data.get("habit_id")
        user_id = data.get("user_id")
        
        # Call Habit Service to get data from selected habit
        habit_service = HabitService()
        h = habit_service.get_one_habit(user_id=user_id, habit_id=habit_id)

        prompt = sys_prompts + "Tasks " + str(h['habit']['user_tasks']) + "\n            Duration " + str(h['habit']['user_tasks']) + "\n            Intensity " + h['habit']['user_intensity']

        #prompt = f"{sys_prompts}\n\n"

        response = self.model.generate_content(prompt)
        return response.text
    
    def basic_chat(self, prompt):
        response = self.model.generate_content(f"{self.sys_prompt} {prompt}")
        return response.text
    
    def model_info(self)->str:
        return(self.model_name)

if __name__ == "__main__":
    assistant = AssistantService(sys_prompt="You are an assistant that summarizes data")
    test = assistant.basic_chat(f"Microsoft Corporation develops and supports software, services, devices and solutions worldwide. The Productivity and Business Processes segment offers office, exchange, SharePoint, Microsoft Teams, office 365 Security and Compliance, Microsoft viva, and Microsoft 365 copilot; and office consumer services, such as Microsoft 365 consumer subscriptions, Office licensed on-premises, and other office services. This segment also provides LinkedIn; and dynamics business solutions, including Dynamics 365, a set of intelligent, cloud-based applications across ERP, CRM, power apps, and power automate; and on-premises ERP and CRM applications. The Intelligent Cloud segment offers server products and cloud services, such as azure and other cloud services; SQL and windows server, visual studio, system center, and related client access licenses, as well as nuance and GitHub; and enterprise services including enterprise support services, industry solutions, and nuance professional services. The More Personal Computing segment offers Windows, including windows OEM licensing and other non-volume licensing of the Windows operating system; Windows commercial comprising volume licensing of the Windows operating system, windows cloud services, and other Windows commercial offerings; patent licensing; and windows Internet of Things; and devices, such as surface, HoloLens, and PC accessories. Additionally, this segment provides gaming, which includes Xbox hardware and content, and first- and third-party content; Xbox game pass and other subscriptions, cloud gaming, advertising, third-party disc royalties, and other cloud services; and search and news advertising, which includes Bing, Microsoft News and Edge, and third-party affiliates. The company sells its products through OEMs, distributors, and resellers; and directly through digital marketplaces, online, and retail stores. The company was founded in 1975 and is headquartered in Redmond, Washington.")
    print(test)

    assistant.model_info()