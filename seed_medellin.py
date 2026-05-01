#!/usr/bin/env python
import httpx
import random

BASE_URL = "http://localhost:8000"

TUTOR_LOCATIONS = [
    ("Belén, Los Alpes", 6.2104, -75.5975),
    ("Los Alpes", 6.1850, -75.5850),
    ("Belén", 6.2050, -75.6020),
    ("Laureles", 6.2442, -75.5898),
    ("Estadio", 6.2508, -75.5860),
    ("La America", 6.2350, -75.6105),
    ("Belen Rosales", 6.2280, -75.6150),
    ("Naranjal", 6.2205, -75.6038),
    ("Poblado", 6.1950, -75.5650),
    ("Centro Medellin", 6.2442, -75.5898),
]

TUTOR_PROFILES = [
    ("Valentina", "Rojas", ["Matemáticas", "Álgebra"], "Ingeniera de sistemas"),
    ("Santiago", "Mejía", ["Física", "Cálculo"], "Docente universitario"),
    ("Daniela", "Pérez", ["Inglés", "Literatura"], "Licenciada en idiomas"),
    ("Andrés", "Gómez", ["Programación", "Desarrollo Web"], "Desarrollador full stack"),
    ("Natalia", "Castaño", ["Química", "Biología"], "Bióloga"),
    ("Camilo", "Ramírez", ["Estadística", "Economía"], "Analista de datos"),
    ("Laura", "Montoya", ["Arte", "Diseño"], "Diseñadora gráfica"),
    ("Diego", "Henao", ["Historia", "Geografía"], "Historiador"),
    ("Sara", "Giraldo", ["Mecánica", "Electromecánica"], "Ingeniera mecánica"),
    ("Juan", "Londoño", ["Programación", "IA"], "Arquitecto de software"),
]

STUDENT_PROFILES = [
    ("Sofía", "Gómez", "Estudiante de bachillerato"),
    ("Andrés", "Herrera", "Estudiante de ingeniería"),
    ("Camila", "Moreno", "Estudiante de medicina"),
    ("Tomás", "Uribe", "Estudiante de diseño"),
]

medellin_tutors = []
for index, (first_name, last_name, specialties, occupation) in enumerate(TUTOR_PROFILES):
    location, lat, lng = TUTOR_LOCATIONS[index % len(TUTOR_LOCATIONS)]
    medellin_tutors.append({
        "email": f"{first_name.lower()}.{last_name.lower()}@tutors.com",
        "password": "password123",
        "display_name": f"{first_name} {last_name}",
        "specialties": specialties,
        "occupation": occupation,
        "location": location,
        "lat": lat + random.uniform(-0.004, 0.004),
        "lng": lng + random.uniform(-0.004, 0.004),
        "rate": random.choice([25000, 30000, 35000, 40000, 45000])
    })

medellin_students = []
for first_name, last_name, occupation in STUDENT_PROFILES:
    medellin_students.append({
        "email": f"{first_name.lower()}.{last_name.lower()}@students.com",
        "password": "password123",
        "display_name": f"{first_name} {last_name}",
        "occupation": occupation,
    })

def register_user(email, password, role="tutor"):
    """Register a user"""
    try:
        response = httpx.post(
            f"{BASE_URL}/auth/register",
            json={"email": email, "password": password, "role": role}
        )
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Registered {role}: {email}")
            return data.get("user", {}).get("id"), data.get("access_token")
        if response.status_code == 400 and "already registered" in response.text.lower():
            login_response = httpx.post(
                f"{BASE_URL}/auth/login",
                json={"email": email, "password": password}
            )
            if login_response.status_code == 200:
                data = login_response.json()
                print(f"↺ Reused existing user {role}: {email}")
                return data.get("user", {}).get("id"), data.get("access_token")
            print(f"✗ Error logging in existing user {email}: {login_response.text}")
            return None, None
        else:
            print(f"✗ Error registering {email}: {response.json()}")
            return None, None
    except Exception as e:
        print(f"✗ Exception registering {email}: {e}")
        return None, None

def create_tutor_profile(token, tutor_data):
    """Create tutor profile"""
    try:
        profile_data = {
            "specialties": tutor_data.get("specialties", []),
            "categories": ["General"],
            "hourly_rate": tutor_data.get("rate", 30000),
            "years_experience": random.randint(2, 10),
            "lat": tutor_data.get("lat"),
            "lng": tutor_data.get("lng")
        }
        response = httpx.post(
            f"{BASE_URL}/tutors/profiles",
            json=profile_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        if response.status_code in [200, 201]:
            print(f"✓ Created tutor profile: {tutor_data['display_name']}")
            return True
        if response.status_code == 400 and "already exists" in response.text.lower():
            update_response = httpx.put(
                f"{BASE_URL}/tutors/profiles",
                json=profile_data,
                headers={"Authorization": f"Bearer {token}"}
            )
            if update_response.status_code in [200, 201]:
                print(f"↺ Updated tutor profile: {tutor_data['display_name']}")
                return True
            print(f"✗ Error updating tutor profile: {update_response.text}")
            return False
        else:
            print(f"✗ Error creating profile: {response.json()}")
            return False
    except Exception as e:
        print(f"✗ Exception creating profile: {e}")
        return False

def create_user_profile(token, display_name, location, occupation=None):
    """Create user profile"""
    try:
        profile_data = {
            "display_name": display_name,
            "bio": occupation or f"Estudiante en {location}",
            "location_name": location
        }
        response = httpx.post(
            f"{BASE_URL}/users/profiles",
            json=profile_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        if response.status_code in [200, 201]:
            print(f"✓ Created user profile: {display_name}")
            return True
        if response.status_code == 400 and "already exists" in response.text.lower():
            update_response = httpx.put(
                f"{BASE_URL}/users/profiles/me",
                json=profile_data,
                headers={"Authorization": f"Bearer {token}"}
            )
            if update_response.status_code in [200, 201]:
                print(f"↺ Updated user profile: {display_name}")
                return True
            print(f"✗ Error updating user profile: {update_response.text}")
            return False
        else:
            print(f"✗ Error creating user profile: {response.json()}")
            return False
    except Exception as e:
        print(f"✗ Exception creating user profile: {e}")
        return False

print("=" * 60)
print("SEMBRANDO TUTORES EN MEDELLÍN")
print("=" * 60)

for tutor in medellin_tutors:
    user_id, token = register_user(tutor["email"], tutor["password"], "tutor")
    if token:
        create_tutor_profile(token, tutor)
        # Create user profile
        create_user_profile(token, tutor["display_name"], tutor["location"], tutor.get("occupation"))

print("\n" + "=" * 60)
print("SEMBRANDO ESTUDIANTES EN MEDELLÍN")
print("=" * 60)

for student in medellin_students:
    user_id, token = register_user(student["email"], student["password"], "student")
    if token:
        create_user_profile(token, student["display_name"], "Medellín", student.get("occupation"))

print("\n" + "=" * 60)
print("✓ SEMILLA COMPLETADA")
print("=" * 60)
