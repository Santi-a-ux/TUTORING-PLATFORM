from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models import TutorProfile
from app.schemas import TutorProfileCreate, TutorProfileUpdate, TutorProfileOut, TutorListOut
from app.dependencies import require_tutor_role, get_current_user
import uuid

router = APIRouter()

@router.post("/profiles", response_model=TutorProfileOut, status_code=status.HTTP_201_CREATED)
async def create_profile(
    profile_in: TutorProfileCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_tutor_role)
):
    user_id = uuid.UUID(current_user["user_id"])
    result = await db.execute(select(TutorProfile).where(TutorProfile.user_id == user_id))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Profile already exists")
    
    coord = f"SRID=4326;POINT({profile_in.lng} {profile_in.lat})" if profile_in.lng and profile_in.lat else None

    new_profile = TutorProfile(
        user_id=user_id,
        specialties=profile_in.specialties,
        categories=profile_in.categories,
        is_available=profile_in.is_available if profile_in.is_available is not None else True,
        hourly_rate=profile_in.hourly_rate,
        years_experience=profile_in.years_experience,
        coordinates=coord
    )
    db.add(new_profile)
    await db.commit()
    await db.refresh(new_profile)
    
    return _format_profile_out(new_profile, lat=profile_in.lat, lng=profile_in.lng)

def _format_profile_out(db_profile: TutorProfile, lat=None, lng=None):
    return {
        "id": db_profile.id,
        "user_id": db_profile.user_id,
        "specialties": db_profile.specialties,
        "categories": db_profile.categories,
        "hourly_rate": db_profile.hourly_rate,
        "years_experience": db_profile.years_experience,
        "is_available": db_profile.is_available,
        "verification_status": db_profile.verification_status,
        "created_at": db_profile.created_at,
        "updated_at": db_profile.updated_at,
        "lat": lat,
        "lng": lng
    }

@router.put('/profiles', response_model=TutorProfileOut)
async def update_profile(
    profile_in: TutorProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_tutor_role)
):
    user_id = uuid.UUID(current_user['user_id'])
    result = await db.execute(select(TutorProfile).where(TutorProfile.user_id == user_id))
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail='Profile not found')
    
    for var, value in vars(profile_in).items():
        if value is not None and var not in ('lat', 'lng'):
            setattr(profile, var, value)
            
    if profile_in.lat is not None and profile_in.lng is not None:
        profile.coordinates = f'SRID=4326;POINT({profile_in.lng} {profile_in.lat})'
        
    await db.commit()
    await db.refresh(profile)
    return _format_profile_out(profile)

@router.get('/profiles/me', response_model=TutorProfileOut)
async def get_my_profile(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_tutor_role)
):
    user_id = uuid.UUID(current_user['user_id'])
    stmt = select(TutorProfile, func.ST_Y(TutorProfile.coordinates).label('lat'), func.ST_X(TutorProfile.coordinates).label('lng')).where(TutorProfile.user_id == user_id)
    result = await db.execute(stmt)
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail='Profile not found')
        
    return _format_profile_out(row.TutorProfile, lat=row.lat, lng=row.lng)

@router.get('/', response_model=TutorListOut)
async def list_tutors(
    category: Optional[str] = None,
    is_available: Optional[bool] = None,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    # 1. Base query for counting AND pagination (only selecting ID)
    base_stmt = select(TutorProfile.id)
    if category:
        base_stmt = base_stmt.where(TutorProfile.categories.any(category))
    if is_available is not None:
        base_stmt = base_stmt.where(TutorProfile.is_available == is_available)

    count_stmt = select(func.count()).select_from(base_stmt.subquery())
    total_result = await db.execute(count_stmt)
    total = total_result.scalar() or 0

    base_stmt = base_stmt.limit(limit).offset(offset)
    ids_result = await db.execute(base_stmt)
    profile_ids = ids_result.scalars().all()

    tutors = []
    if profile_ids:
        # 2. Fetch full profiles with geometry functions bypassing limit bugs
        fetch_stmt = select(
            TutorProfile,
            func.ST_Y(TutorProfile.coordinates).label('lat'),
            func.ST_X(TutorProfile.coordinates).label('lng')
        ).where(TutorProfile.id.in_(profile_ids))

        profiles_result = await db.execute(fetch_stmt)
        for row in profiles_result.all():
            tutors.append(_format_profile_out(row.TutorProfile, lat=row.lat, lng=row.lng))

    return {'tutors': tutors, 'total': total}
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail='Tutor not found')
        
    return _format_profile_out(row.TutorProfile, lat=row.lat, lng=row.lng)

@router.put('/availability', response_model=TutorProfileOut)
async def update_availability(
    is_available: bool,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(require_tutor_role)
):
    user_id = uuid.UUID(current_user['user_id'])
    result = await db.execute(select(TutorProfile).where(TutorProfile.user_id == user_id))
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail='Profile not found')
        
    profile.is_available = is_available
    await db.commit()
    await db.refresh(profile)
    return _format_profile_out(profile)
