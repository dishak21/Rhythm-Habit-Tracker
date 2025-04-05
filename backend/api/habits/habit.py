from datetime import datetime
class Habit:
    def __init__(
        self, 
        name: str, 
        category: str, 
        color: str, 
        icon: str, 
        schedule_type: str, 
        user_context: str,
        user_tasks: [],
        user_intensity: str,
        user_duration: [],
        id: str = None,
        days = None, 
        exclude_weekends: bool = False, 
        createdAt: datetime = None
        
    ):
        self.name = name
        self.category = category
        self.color = color
        self.icon = icon
        self.schedule_type = schedule_type
        self.user_context = user_context
        self.user_tasks = user_tasks
        self.user_intensity = user_intensity
        self.user_duration = user_duration
        self.id = id or None
        self.days = days or []
        self.exclude_weekends = exclude_weekends
        self.createdAt = createdAt or datetime.now() 



    def to_dict(self):
        """
        Convert a Habit instance back into a Firestore-compatible dictionary.
        """
        return {
            "id" : self.id,
            "name": self.name,
            "category": self.category,
            "color": self.color,
            "icon": self.icon,
            "schedule": {
                "type": self.schedule_type,
                "days": self.days,
                "excludeWeekends": self.exclude_weekends
            },
            "user_context": self.user_context,
            "user_tasks": self.user_tasks,
            "user_duration":self.user_duration,
            "user_intensity":self.user_intensity,
            "createdAt" : self.createdAt or datetime.now()
        }
    
    def from_dict(data, id: str = None) -> 'Habit':

        return Habit(
            id=id or data.get("id"),
            name=data.get("name", ""),
            category=data.get("category", ""),
            color=data.get("color", ""),
            icon=data.get("icon", ""),
            schedule_type=data.get("schedule", {}).get("type", ""),
            days=data.get("schedule", {}).get("days", []),
            exclude_weekends=data.get("schedule", {}).get("excludeWeekends", False),
            user_context=data.get("user_context", ""),
            user_tasks=data.get("user_tasks", []),
            user_duration=data.get("user_duration", []),
            user_intensity=data.get("user_intensity", ""),
            createdAt=data.get("createdAt", datetime.now()),
        )

    def __repr__(self):
        return (f"Habit(Id = {self.id} name={self.name}, category={self.category}, color={self.color}, "
                f"icon={self.icon}, schedule_type={self.schedule_type}, days={self.days}, "
                f"exclude_weekends={self.exclude_weekends}, user_context={self.user_context}," 
                f"user_tasks={self.user_tasks}, user_internsity={self.user_intensity}, user_duration={self.user_duration}, createdAt={self.createdAt})")
    
    def __str__(self):
        return f"{self.id} {self.name} {self.category} {self.user_context}"

if __name__ == '__main__':
    habits = [
    Habit(name="Morning Run", category="Health", color="blue", icon="runner", schedule_type="daily", exclude_weekends=False, user_context="Stay fit"),
    Habit(name="Read a Book", category="Learning", color="green", icon="book", schedule_type="weekly", exclude_weekends=True, user_context="Personal growth"),
    Habit(name="123", category="cat", color="color", icon="icon", schedule_type="daily", exclude_weekends=False, user_context="user context text"),
]
    print(habits[0].to_dict())

