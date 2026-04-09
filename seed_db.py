import requests

API_BASE = "http://localhost:8000"

users_to_create = [
    {"email": "estudiante1@test.com", "password": "password123", "role": "student"},
    {"email": "estudiante2@test.com", "password": "password123", "role": "student"},
    {"email": "mecanico1@test.com", "password": "password123", "role": "tutor"},
    {"email": "psicologo1@test.com", "password": "password123", "role": "tutor"},
    {"email": "mate1@test.com", "password": "password123", "role": "tutor"},
    {"email": "software1@test.com", "password": "password123", "role": "tutor"},   
    {"email": "software2@test.com", "password": "password123", "role": "tutor"}, 
]

tutors_profiles = [
    {"lat": 6.2312, "lng": -75.6105, "rate": 20, "spec": ["Mecánico", "Electromecánica"]}, 
    {"lat": 6.2350, "lng": -75.6050, "rate": 25, "spec": ["Psicólogo", "Terapia Cognitiva"]}, 
    {"lat": 6.2280, "lng": -75.6150, "rate": 15, "spec": ["Matemáticas", "Álgebra"]}, 
    {"lat": 6.2400, "lng": -75.6200, "rate": 30, "spec": ["Software", "Programación Web"]}, 
    {"lat": 6.2518, "lng": -75.5636, "rate": 35, "spec": ["Software", "Arquitectura Múltiple"]}, 
]

print("Registrando usuarios...")
tokens = {}

for u in users_to_create:
    try:
        res = requests.post(f"{API_BASE}/auth/register", json=u)
        if res.status_code == 200:
            print(f"Registrado {u['email']}")
        else:
            print(f"Fallo al registrar {u['email']}: {res.text}")
    except Exception as e:
        print(f"Error registrando {u['email']}: {e}")

print("Iniciando sesión de tutores...")
tutor_index = 0
for u in users_to_create:
    if u['role'] == "tutor":
        res = requests.post(f"{API_BASE}/auth/login", json={"email": u['email'], "password": u["password"]})
        if res.status_code == 200:
            token = res.json()["access_token"]
            prof_data = tutors_profiles[tutor_index]

            payload = {
                "specialties": prof_data["spec"],
                "categories": ["profesional", "académico"],
                "is_available": True,
                "hourly_rate": prof_data["rate"],
                "years_experience": tutor_index + 2,
                "lat": prof_data["lat"],
                "lng": prof_data["lng"]
            }
            p_res = requests.post(f"{API_BASE}/tutors/profiles", json=payload, headers={"Authorization": f"Bearer {token}"})
            if p_res.status_code == 201:
                print(f"Perfil creado para {u['email']}")
            elif p_res.status_code == 400:
                p_res = requests.put(f"{API_BASE}/tutors/profiles", json=payload, headers={"Authorization": f"Bearer {token}"})
                if p_res.status_code == 200:
                    print(f"Perfil actualizado para {u['email']}")
                else:
                    print(f"Fallo al actualizar el perfil para {u['email']}: {p_res.text}")
            else:
                print(f"Fallo el perfil para {u['email']}: {p_res.text}")
            tutor_index += 1
        else:
            print(f"Fallo el login para {u['email']}")

print("Semilla completada.")
