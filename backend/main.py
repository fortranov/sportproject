from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, Date, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from datetime import date, datetime, timedelta
from typing import List, Optional
import os

# Database setup
SQLITE_DATABASE_URL = "sqlite:///./triathlon_training.db"
engine = create_engine(SQLITE_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI(title="Triathlon Training Service", description="Training plan service based on Joe Friel's Triathlete's Training Bible")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    uin = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    training_plans = relationship("TrainingPlan", back_populates="user")

class TrainingPlan(Base):
    __tablename__ = "training_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    competition_date = Column(Date, nullable=False)
    difficulty = Column(Integer, nullable=False)  # 0-1000
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="training_plans")
    training_days = relationship("TrainingDay", back_populates="training_plan")

class TrainingDay(Base):
    __tablename__ = "training_days"
    
    id = Column(Integer, primary_key=True, index=True)
    training_plan_id = Column(Integer, ForeignKey("training_plans.id"))
    date = Column(Date, nullable=False)
    swimming_hours = Column(Float, default=0.0)
    cycling_hours = Column(Float, default=0.0)
    running_hours = Column(Float, default=0.0)
    total_hours = Column(Float, default=0.0)
    
    training_plan = relationship("TrainingPlan", back_populates="training_days")

# Training zones and periodization data based on Joe Friel's methodology
class TrainingZones(Base):
    __tablename__ = "training_zones"
    
    id = Column(Integer, primary_key=True, index=True)
    sport = Column(String, nullable=False)  # swimming, cycling, running
    zone = Column(Integer, nullable=False)  # 1-7
    description = Column(String, nullable=False)
    intensity = Column(Float, nullable=False)  # percentage of max

class PeriodizationTemplate(Base):
    __tablename__ = "periodization_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    difficulty_min = Column(Integer, nullable=False)
    difficulty_max = Column(Integer, nullable=False)
    weeks_out = Column(Integer, nullable=False)  # weeks before competition
    swimming_percentage = Column(Float, nullable=False)
    cycling_percentage = Column(Float, nullable=False)
    running_percentage = Column(Float, nullable=False)
    total_hours_per_week = Column(Float, nullable=False)

# Pydantic models
class UserCreate(BaseModel):
    uin: str

class TrainingPlanCreate(BaseModel):
    uin: str
    competition_date: date
    difficulty: int

class TrainingDayResponse(BaseModel):
    date: date
    swimming_hours: float
    cycling_hours: float
    running_hours: float
    total_hours: float

class TrainingPlanResponse(BaseModel):
    id: int
    competition_date: date
    difficulty: int
    training_days: List[TrainingDayResponse]

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize training data
def init_training_data(db: Session):
    # Check if data already exists
    if db.query(TrainingZones).first() is not None:
        return
    
    # Training zones data based on Joe Friel's methodology
    zones_data = [
        # Swimming zones
        {"sport": "swimming", "zone": 1, "description": "Active Recovery", "intensity": 0.6},
        {"sport": "swimming", "zone": 2, "description": "Aerobic", "intensity": 0.7},
        {"sport": "swimming", "zone": 3, "description": "Tempo", "intensity": 0.8},
        {"sport": "swimming", "zone": 4, "description": "Lactate Threshold", "intensity": 0.85},
        {"sport": "swimming", "zone": 5, "description": "VO2 Max", "intensity": 0.95},
        {"sport": "swimming", "zone": 6, "description": "Neuromuscular", "intensity": 1.0},
        
        # Cycling zones
        {"sport": "cycling", "zone": 1, "description": "Active Recovery", "intensity": 0.55},
        {"sport": "cycling", "zone": 2, "description": "Aerobic", "intensity": 0.75},
        {"sport": "cycling", "zone": 3, "description": "Tempo", "intensity": 0.85},
        {"sport": "cycling", "zone": 4, "description": "Lactate Threshold", "intensity": 0.95},
        {"sport": "cycling", "zone": 5, "description": "VO2 Max", "intensity": 1.05},
        {"sport": "cycling", "zone": 6, "description": "Neuromuscular", "intensity": 1.2},
        
        # Running zones
        {"sport": "running", "zone": 1, "description": "Active Recovery", "intensity": 0.65},
        {"sport": "running", "zone": 2, "description": "Aerobic", "intensity": 0.75},
        {"sport": "running", "zone": 3, "description": "Tempo", "intensity": 0.85},
        {"sport": "running", "zone": 4, "description": "Lactate Threshold", "intensity": 0.9},
        {"sport": "running", "zone": 5, "description": "VO2 Max", "intensity": 1.0},
        {"sport": "running", "zone": 6, "description": "Neuromuscular", "intensity": 1.1},
    ]
    
    for zone_data in zones_data:
        zone = TrainingZones(**zone_data)
        db.add(zone)
    
    # Periodization templates based on difficulty and weeks before competition
    periodization_data = [
        # Beginner level (0-300 difficulty)
        {"difficulty_min": 0, "difficulty_max": 300, "weeks_out": 20, "swimming_percentage": 0.2, "cycling_percentage": 0.5, "running_percentage": 0.3, "total_hours_per_week": 6.0},
        {"difficulty_min": 0, "difficulty_max": 300, "weeks_out": 16, "swimming_percentage": 0.25, "cycling_percentage": 0.45, "running_percentage": 0.3, "total_hours_per_week": 7.0},
        {"difficulty_min": 0, "difficulty_max": 300, "weeks_out": 12, "swimming_percentage": 0.3, "cycling_percentage": 0.4, "running_percentage": 0.3, "total_hours_per_week": 8.0},
        {"difficulty_min": 0, "difficulty_max": 300, "weeks_out": 8, "swimming_percentage": 0.3, "cycling_percentage": 0.4, "running_percentage": 0.3, "total_hours_per_week": 9.0},
        {"difficulty_min": 0, "difficulty_max": 300, "weeks_out": 4, "swimming_percentage": 0.35, "cycling_percentage": 0.35, "running_percentage": 0.3, "total_hours_per_week": 8.0},
        {"difficulty_min": 0, "difficulty_max": 300, "weeks_out": 2, "swimming_percentage": 0.4, "cycling_percentage": 0.3, "running_percentage": 0.3, "total_hours_per_week": 6.0},
        {"difficulty_min": 0, "difficulty_max": 300, "weeks_out": 1, "swimming_percentage": 0.4, "cycling_percentage": 0.3, "running_percentage": 0.3, "total_hours_per_week": 4.0},
        
        # Intermediate level (301-700 difficulty)
        {"difficulty_min": 301, "difficulty_max": 700, "weeks_out": 24, "swimming_percentage": 0.25, "cycling_percentage": 0.45, "running_percentage": 0.3, "total_hours_per_week": 10.0},
        {"difficulty_min": 301, "difficulty_max": 700, "weeks_out": 20, "swimming_percentage": 0.3, "cycling_percentage": 0.4, "running_percentage": 0.3, "total_hours_per_week": 12.0},
        {"difficulty_min": 301, "difficulty_max": 700, "weeks_out": 16, "swimming_percentage": 0.3, "cycling_percentage": 0.4, "running_percentage": 0.3, "total_hours_per_week": 14.0},
        {"difficulty_min": 301, "difficulty_max": 700, "weeks_out": 12, "swimming_percentage": 0.3, "cycling_percentage": 0.4, "running_percentage": 0.3, "total_hours_per_week": 15.0},
        {"difficulty_min": 301, "difficulty_max": 700, "weeks_out": 8, "swimming_percentage": 0.3, "cycling_percentage": 0.4, "running_percentage": 0.3, "total_hours_per_week": 16.0},
        {"difficulty_min": 301, "difficulty_max": 700, "weeks_out": 4, "swimming_percentage": 0.35, "cycling_percentage": 0.35, "running_percentage": 0.3, "total_hours_per_week": 14.0},
        {"difficulty_min": 301, "difficulty_max": 700, "weeks_out": 2, "swimming_percentage": 0.4, "cycling_percentage": 0.3, "running_percentage": 0.3, "total_hours_per_week": 10.0},
        {"difficulty_min": 301, "difficulty_max": 700, "weeks_out": 1, "swimming_percentage": 0.4, "cycling_percentage": 0.3, "running_percentage": 0.3, "total_hours_per_week": 6.0},
        
        # Advanced level (701-1000 difficulty)
        {"difficulty_min": 701, "difficulty_max": 1000, "weeks_out": 28, "swimming_percentage": 0.25, "cycling_percentage": 0.45, "running_percentage": 0.3, "total_hours_per_week": 15.0},
        {"difficulty_min": 701, "difficulty_max": 1000, "weeks_out": 24, "swimming_percentage": 0.3, "cycling_percentage": 0.4, "running_percentage": 0.3, "total_hours_per_week": 18.0},
        {"difficulty_min": 701, "difficulty_max": 1000, "weeks_out": 20, "swimming_percentage": 0.3, "cycling_percentage": 0.4, "running_percentage": 0.3, "total_hours_per_week": 20.0},
        {"difficulty_min": 701, "difficulty_max": 1000, "weeks_out": 16, "swimming_percentage": 0.3, "cycling_percentage": 0.4, "running_percentage": 0.3, "total_hours_per_week": 22.0},
        {"difficulty_min": 701, "difficulty_max": 1000, "weeks_out": 12, "swimming_percentage": 0.3, "cycling_percentage": 0.4, "running_percentage": 0.3, "total_hours_per_week": 24.0},
        {"difficulty_min": 701, "difficulty_max": 1000, "weeks_out": 8, "swimming_percentage": 0.3, "cycling_percentage": 0.4, "running_percentage": 0.3, "total_hours_per_week": 25.0},
        {"difficulty_min": 701, "difficulty_max": 1000, "weeks_out": 4, "swimming_percentage": 0.35, "cycling_percentage": 0.35, "running_percentage": 0.3, "total_hours_per_week": 20.0},
        {"difficulty_min": 701, "difficulty_max": 1000, "weeks_out": 2, "swimming_percentage": 0.4, "cycling_percentage": 0.3, "running_percentage": 0.3, "total_hours_per_week": 15.0},
        {"difficulty_min": 701, "difficulty_max": 1000, "weeks_out": 1, "swimming_percentage": 0.4, "cycling_percentage": 0.3, "running_percentage": 0.3, "total_hours_per_week": 8.0},
    ]
    
    for period_data in periodization_data:
        period = PeriodizationTemplate(**period_data)
        db.add(period)
    
    db.commit()

# Initialize data on startup
@app.on_event("startup")
async def startup_event():
    db = SessionLocal()
    try:
        init_training_data(db)
    finally:
        db.close()

def calculate_weeks_until_competition(competition_date: date) -> int:
    """Calculate weeks until competition date"""
    today = date.today()
    days_until = (competition_date - today).days
    return max(1, days_until // 7)

def get_periodization_template(difficulty: int, weeks_out: int, db: Session) -> Optional[PeriodizationTemplate]:
    """Get the appropriate periodization template based on difficulty and weeks out"""
    template = db.query(PeriodizationTemplate).filter(
        PeriodizationTemplate.difficulty_min <= difficulty,
        PeriodizationTemplate.difficulty_max >= difficulty,
        PeriodizationTemplate.weeks_out <= weeks_out
    ).order_by(PeriodizationTemplate.weeks_out.desc()).first()
    
    return template

def generate_training_plan(user_id: int, competition_date: date, difficulty: int, db: Session) -> TrainingPlan:
    """Generate a training plan based on Joe Friel's methodology"""
    
    # Create training plan
    training_plan = TrainingPlan(
        user_id=user_id,
        competition_date=competition_date,
        difficulty=difficulty
    )
    db.add(training_plan)
    db.flush()  # Get the ID
    
    # Calculate training days from today until competition
    start_date = date.today()
    current_date = start_date
    
    while current_date < competition_date:
        weeks_out = calculate_weeks_until_competition(competition_date)
        template = get_periodization_template(difficulty, weeks_out, db)
        
        if not template:
            # Fallback to basic template
            swimming_hours = 1.0
            cycling_hours = 2.0
            running_hours = 1.0
        else:
            # Calculate daily hours based on template (assuming 6 training days per week)
            daily_total = template.total_hours_per_week / 6
            swimming_hours = daily_total * template.swimming_percentage
            cycling_hours = daily_total * template.cycling_percentage
            running_hours = daily_total * template.running_percentage
        
        # Adjust for day of week (lighter on Sundays)
        if current_date.weekday() == 6:  # Sunday
            swimming_hours *= 0.5
            cycling_hours *= 0.5
            running_hours *= 0.5
        
        total_hours = swimming_hours + cycling_hours + running_hours
        
        training_day = TrainingDay(
            training_plan_id=training_plan.id,
            date=current_date,
            swimming_hours=round(swimming_hours, 2),
            cycling_hours=round(cycling_hours, 2),
            running_hours=round(running_hours, 2),
            total_hours=round(total_hours, 2)
        )
        db.add(training_day)
        
        current_date += timedelta(days=1)
    
    db.commit()
    return training_plan

# API Endpoints
@app.post("/training-plan", response_model=TrainingPlanResponse)
async def create_training_plan(plan_data: TrainingPlanCreate, db: Session = Depends(get_db)):
    """Create or update a training plan for a user"""
    
    # Validate difficulty range
    if not (0 <= plan_data.difficulty <= 1000):
        raise HTTPException(status_code=400, detail="Difficulty must be between 0 and 1000")
    
    # Validate competition date
    if plan_data.competition_date <= date.today():
        raise HTTPException(status_code=400, detail="Competition date must be in the future")
    
    # Get or create user
    user = db.query(User).filter(User.uin == plan_data.uin).first()
    if not user:
        user = User(uin=plan_data.uin)
        db.add(user)
        db.flush()
    
    # Delete existing training plans for this user
    existing_plans = db.query(TrainingPlan).filter(TrainingPlan.user_id == user.id).all()
    for plan in existing_plans:
        db.query(TrainingDay).filter(TrainingDay.training_plan_id == plan.id).delete()
        db.delete(plan)
    db.commit()
    
    # Generate new training plan
    training_plan = generate_training_plan(
        user.id, 
        plan_data.competition_date, 
        plan_data.difficulty, 
        db
    )
    
    # Fetch the plan with training days for response
    plan_with_days = db.query(TrainingPlan).filter(TrainingPlan.id == training_plan.id).first()
    
    return TrainingPlanResponse(
        id=plan_with_days.id,
        competition_date=plan_with_days.competition_date,
        difficulty=plan_with_days.difficulty,
        training_days=[
            TrainingDayResponse(
                date=day.date,
                swimming_hours=day.swimming_hours,
                cycling_hours=day.cycling_hours,
                running_hours=day.running_hours,
                total_hours=day.total_hours
            )
            for day in sorted(plan_with_days.training_days, key=lambda x: x.date)
        ]
    )

@app.get("/training-plan/{uin}", response_model=TrainingPlanResponse)
async def get_training_plan(uin: str, db: Session = Depends(get_db)):
    """Get current training plan for a user"""
    
    user = db.query(User).filter(User.uin == uin).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    training_plan = db.query(TrainingPlan).filter(TrainingPlan.user_id == user.id).first()
    if not training_plan:
        raise HTTPException(status_code=404, detail="No training plan found for this user")
    
    return TrainingPlanResponse(
        id=training_plan.id,
        competition_date=training_plan.competition_date,
        difficulty=training_plan.difficulty,
        training_days=[
            TrainingDayResponse(
                date=day.date,
                swimming_hours=day.swimming_hours,
                cycling_hours=day.cycling_hours,
                running_hours=day.running_hours,
                total_hours=day.total_hours
            )
            for day in sorted(training_plan.training_days, key=lambda x: x.date)
        ]
    )

@app.delete("/training-plan/{uin}")
async def delete_training_plan(uin: str, db: Session = Depends(get_db)):
    """Delete training plan for a user"""
    
    user = db.query(User).filter(User.uin == uin).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete training plans and associated days
    plans = db.query(TrainingPlan).filter(TrainingPlan.user_id == user.id).all()
    if not plans:
        raise HTTPException(status_code=404, detail="No training plan found for this user")
    
    for plan in plans:
        db.query(TrainingDay).filter(TrainingDay.training_plan_id == plan.id).delete()
        db.delete(plan)
    
    db.commit()
    
    return {"message": "Training plan deleted successfully"}

@app.get("/")
async def root():
    return {"message": "Triathlon Training Service based on Joe Friel's Training Bible"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
