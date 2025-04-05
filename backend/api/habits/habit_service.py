import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from api.habits.habit_repository import HabitRepository
from api.habits.habit import Habit

class HabitService:
    """
    Service layer for managing habit-related operations.

    This class serves as the intermediary between the controllers (API endpoints)
    and the repository (data access layer). It handles business logic and
    data transformations.
    """

    def __init__(self):
        self.repository = HabitRepository()

    def get_user_habits(self, user_id: str) -> list[dict]:
        """
        Retrieves all habits for a given user.

        This function interacts with the repository layer to fetch
        user habits and transforms them into dictionary format.

        Args:
            user_id (str): The ID of the user.

        Returns:
            list[dict]: A list of dictionaries representing the user's habits.
        """
        habits = self.repository.get_user_habits(user_id)
        
        habit_dicts = []
        category_counts = {}

        for habit in habits:
            habit_data = habit.to_dict()
            habit_dicts.append(habit_data)
            
            # Update category count
            category = habit_data.get('category', 'Uncategorized')  # Default to 'Uncategorized' if category is missing
            color = habit_data.get('color', 'No Color')  # Default to 'No Color' if color is missing
            
            if category not in category_counts:
                # Add the category with count and color only once
                category_counts[category] = {"count": 0, "color": color}
            
            # Increment the count for the category
            category_counts[category]["count"] += 1

        # Return both the list of habit dictionaries and category counts
        return {
            "habits": habit_dicts,
            "category_counts": category_counts
        }
    
    def get_one_habit(self, user_id: str, habit_id:str) -> Habit:
        habit = self.repository.get_one_habit(user_id, habit_id)
        habit_data = habit.to_dict()
        return {"habit": habit_data}

    def add_new_habit(self, data) -> Habit:
        user_id = data.get("user_id")

        # Extract data
        name = data.get("name")
        category = data.get("category")
        color = data.get("color")
        icon = data.get("icon")
        user_context = data.get("user_context")
        user_tasks = data.get("user_task")
        user_intensity = data.get("user_intensity")
        user_duration = data.get("user_duration")
        schedule_type = data.get("schedule_type", "Daily")  # Default to "Daily" if not provided
        days = data.get("days", ["monday", "tuesday"])  # Default days if not provided
        exclude_weekends = data.get("exclude_weekends")

        # Create Habit instance
        new_habit = Habit(
            name=name,
            category=category,
            color=color,
            icon=icon,
            schedule_type=schedule_type,
            user_context=user_context,
            user_tasks=user_tasks,
            user_duration=user_duration,
            user_intensity=user_intensity,
            days=days,
            exclude_weekends=exclude_weekends
            )
        
        return self.repository.add_new_habit(user_id, new_habit)

    def delete_habit(self, data):
        user_id = data.get("user_id")
        habit_id = data.get("habit_id")
        
        return self.repository.delete_habit(user_id, habit_id)
    

if __name__ == "__main__":
    print("Oui")