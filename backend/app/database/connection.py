import os
import json
from typing import List, Dict, Any, Optional
import pymongo
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "government_assistant")
COLLECTION_NAME = "government_schemes"

class DatabaseManager:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self.collection = None
        self.use_fallback = False
        self._in_memory_schemes: List[Dict[str, Any]] = []

    async def connect(self):
        try:
            self.client = AsyncIOMotorClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
            # Check connection
            await self.client.admin.command('ping')
            self.db = self.client[DATABASE_NAME]
            self.collection = self.db[COLLECTION_NAME]
            self.use_fallback = False

            # Create Indexes as required by Section 30
            indexes = [
                ("state", pymongo.ASCENDING),
                ("government_level", pymongo.ASCENDING),
                ("education_level", pymongo.ASCENDING),
                ("category", pymongo.ASCENDING),
                ("status", pymongo.ASCENDING),
                ("academic_year", pymongo.ASCENDING),
                ("verification_status", pymongo.ASCENDING),
                ("scheme_id", pymongo.ASCENDING)
            ]
            for field, order in indexes:
                await self.collection.create_index([(field, order)], background=True)

            print("Successfully connected to MongoDB server.")
        except Exception as e:
            print(f"MongoDB connection notice: {e}")
            print("Running with in-memory JSON scheme database manager.")
            self.use_fallback = True

        # Ensure seed data is loaded
        await self._ensure_seed_data()

    async def _ensure_seed_data(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        seed_file = os.path.join(base_dir, "..", "data", "seed_schemes.json")
        if not os.path.exists(seed_file):
            seed_file = os.path.join(base_dir, "data", "seed_schemes.json")
        if not os.path.exists(seed_file):
            seed_file = os.path.join(os.getcwd(), "data", "seed_schemes.json")

        if not os.path.exists(seed_file):
            return

        with open(seed_file, "r", encoding="utf-8") as f:
            seed_schemes = json.load(f)

        if not self.use_fallback and self.collection is not None:
            count = await self.collection.count_documents({})
            if count == 0:
                print(f"Seeding {len(seed_schemes)} schemes into MongoDB collection '{COLLECTION_NAME}'...")
                await self.collection.insert_many(seed_schemes)
        else:
            self._in_memory_schemes = seed_schemes
            print(f"Loaded {len(self._in_memory_schemes)} seed schemes into memory.")

    async def get_all_schemes(self) -> List[Dict[str, Any]]:
        if not self.use_fallback and self.collection is not None:
            cursor = self.collection.find({}, {"_id": 0})
            return await cursor.to_list(length=1000)
        return list(self._in_memory_schemes)

    async def get_scheme_by_id(self, scheme_id: str) -> Optional[Dict[str, Any]]:
        if not self.use_fallback and self.collection is not None:
            return await self.collection.find_one({"scheme_id": scheme_id}, {"_id": 0})
        for s in self._in_memory_schemes:
            if s.get("scheme_id") == scheme_id:
                return s
        return None

    async def insert_scheme(self, scheme_data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.use_fallback and self.collection is not None:
            await self.collection.insert_one(scheme_data)
        else:
            self._in_memory_schemes.append(scheme_data)
        return scheme_data

    async def update_scheme(self, scheme_id: str, scheme_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not self.use_fallback and self.collection is not None:
            await self.collection.update_one({"scheme_id": scheme_id}, {"$set": scheme_data})
            return await self.get_scheme_by_id(scheme_id)
        else:
            for idx, s in enumerate(self._in_memory_schemes):
                if s.get("scheme_id") == scheme_id:
                    self._in_memory_schemes[idx].update(scheme_data)
                    return self._in_memory_schemes[idx]
        return None

db_manager = DatabaseManager()
