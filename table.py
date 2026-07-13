from json_db_lite import JSONDatabase
import os

folder_name = "databases"

if not os.path.exists(folder_name):
    os.mkdir(folder_name) 

class Heroes:
    def __init__(self) -> None:
        db_path = f"{folder_name}/hero_db.json"
        
        # БЕЗОПАСНОСТЬ: Если файла базы нет, json_db_lite может вернуть ошибку.
        # Принудительно создаем пустой JSON-файл со списком, если он отсутствует.
        if not os.path.exists(db_path):
            with open(db_path, 'w', encoding='utf-8') as f:
                f.write('[]') # База данных инициализируется как пустой список
                
        self.db = JSONDatabase(db_path)
    
    def get_db(self) -> list:
        return self.db.get_all_records()
    
    def add_record(self, data: dict) -> None:
        # Передаем словарь в метод добавления
        self.db.add_records(data)


class Hero:
    hero_db = Heroes()
    
    def __init__(self, name: str = None, race: str = None, character_class: str = None, lvl: int = None, skills: list = None, destribition: str = None):
        self.id = self.get_id()
        self.name = name
        self.race = race
        self.character_class = character_class
        self.lvl = lvl
        self.skills = skills if skills is not None else []
        self.destribition = destribition

        # Автоматическое сохранение в базу данных при создании объекта
        self.hero_db.add_record(data=self.get_json())

    def get_id(self) -> int:
        data = self.hero_db.get_db()

        # Если база данных пустая, возвращаем ID = 1
        if not data:
            return 1
        
        return max(data, key=lambda hero: hero['id'])['id'] + 1

    def get_json(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "race": self.race,
            "character_class": self.character_class,
            "lvl": self.lvl,
            "skills": self.skills,
            "destribition": self.destribition
        }