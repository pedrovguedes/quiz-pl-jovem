#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime
import uuid

class PLJovemAPITester:
    def __init__(self):
        self.base_url = "https://pl-history-challenge.preview.emergentagent.com/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "status": "PASS" if success else "FAIL",
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status_icon = "✅" if success else "❌"
        print(f"{status_icon} {name}: {details}")
        return success

    def test_register_participant(self):
        """Test participant registration"""
        test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        participant_data = {
            "nome": "João Silva Teste",
            "email": test_email,
            "telefone": "(11) 98765-4321",
            "endereco": "Rua das Flores, 123",
            "numero": "456",
            "cep": "12345-678"
        }
        
        try:
            response = requests.post(f"{self.base_url}/register", json=participant_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if all(key in data for key in ["id", "nome", "email", "pontuacao"]):
                    return self.log_test("Register Participant", True, f"Status {response.status_code}, ID: {data.get('id')[:8]}...")
                else:
                    return self.log_test("Register Participant", False, f"Missing required fields in response: {list(data.keys())}")
            else:
                return self.log_test("Register Participant", False, f"Status {response.status_code}: {response.text[:100]}")
                
        except requests.RequestException as e:
            return self.log_test("Register Participant", False, f"Request error: {str(e)}")
        except Exception as e:
            return self.log_test("Register Participant", False, f"Unexpected error: {str(e)}")

    def test_duplicate_email(self):
        """Test duplicate email validation"""
        test_email = f"duplicate_{uuid.uuid4().hex[:8]}@example.com"
        participant_data = {
            "nome": "Maria Teste",
            "email": test_email,
            "telefone": "(21) 98765-4321",
            "endereco": "Av. Brasil, 789",
            "numero": "101",
            "cep": "87654-321"
        }
        
        try:
            # First registration
            response1 = requests.post(f"{self.base_url}/register", json=participant_data, timeout=10)
            
            if response1.status_code != 200:
                return self.log_test("Duplicate Email Validation", False, f"First registration failed: {response1.status_code}")
            
            # Second registration with same email
            response2 = requests.post(f"{self.base_url}/register", json=participant_data, timeout=10)
            
            if response2.status_code == 400:
                error_detail = response2.json().get('detail', '')
                if 'já cadastrado' in error_detail.lower():
                    return self.log_test("Duplicate Email Validation", True, f"Status {response2.status_code}: {error_detail}")
                else:
                    return self.log_test("Duplicate Email Validation", False, f"Wrong error message: {error_detail}")
            else:
                return self.log_test("Duplicate Email Validation", False, f"Expected 400, got {response2.status_code}")
                
        except requests.RequestException as e:
            return self.log_test("Duplicate Email Validation", False, f"Request error: {str(e)}")
        except Exception as e:
            return self.log_test("Duplicate Email Validation", False, f"Unexpected error: {str(e)}")

    def test_get_quiz_questions(self):
        """Test quiz questions endpoint"""
        try:
            response = requests.get(f"{self.base_url}/quiz/questions", timeout=10)
            
            if response.status_code == 200:
                questions = response.json()
                
                if len(questions) == 10:
                    # Check question structure
                    first_question = questions[0]
                    required_fields = ["id", "pergunta", "opcoes"]
                    
                    if all(field in first_question for field in required_fields):
                        if len(first_question["opcoes"]) == 4:
                            # Ensure no answers are revealed
                            if "resposta_correta" not in first_question:
                                return self.log_test("Get Quiz Questions", True, f"10 questions with 4 options each, no answers revealed")
                            else:
                                return self.log_test("Get Quiz Questions", False, "Questions contain answers (security issue)")
                        else:
                            return self.log_test("Get Quiz Questions", False, f"Expected 4 options, got {len(first_question['opcoes'])}")
                    else:
                        return self.log_test("Get Quiz Questions", False, f"Missing fields: {[f for f in required_fields if f not in first_question]}")
                else:
                    return self.log_test("Get Quiz Questions", False, f"Expected 10 questions, got {len(questions)}")
            else:
                return self.log_test("Get Quiz Questions", False, f"Status {response.status_code}: {response.text[:100]}")
                
        except requests.RequestException as e:
            return self.log_test("Get Quiz Questions", False, f"Request error: {str(e)}")
        except Exception as e:
            return self.log_test("Get Quiz Questions", False, f"Unexpected error: {str(e)}")

    def test_quiz_submission(self):
        """Test quiz submission and scoring"""
        # First create a participant
        test_email = f"quiz_{uuid.uuid4().hex[:8]}@example.com"
        participant_data = {
            "nome": "Pedro Quiz Teste",
            "email": test_email,
            "telefone": "(31) 98765-4321",
            "endereco": "Rua do Quiz, 42",
            "numero": "7",
            "cep": "30000-000"
        }
        
        try:
            # Register participant
            reg_response = requests.post(f"{self.base_url}/register", json=participant_data, timeout=10)
            if reg_response.status_code != 200:
                return self.log_test("Quiz Submission", False, f"Failed to register participant: {reg_response.status_code}")
            
            # Submit quiz with all correct answers (index 1 for questions 2,4,7,8,9,10 and index 0,2 for others)
            # Based on the hardcoded answers in server.py
            correct_answers = [0, 1, 2, 1, 2, 2, 1, 1, 1, 1]  # All correct answers
            
            quiz_data = {
                "email": test_email,
                "respostas": correct_answers
            }
            
            response = requests.post(f"{self.base_url}/quiz/submit", json=quiz_data, timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                expected_score = len(correct_answers) * 100  # 10 questions * 100 points each
                
                if (result.get("pontuacao") == expected_score and 
                    result.get("total_perguntas") == 10 and 
                    result.get("acertos") == 10):
                    return self.log_test("Quiz Submission", True, f"Perfect score: {result['pontuacao']} points")
                else:
                    return self.log_test("Quiz Submission", False, 
                                       f"Score mismatch - Expected: {expected_score}, Got: {result.get('pontuacao')}")
            else:
                return self.log_test("Quiz Submission", False, f"Status {response.status_code}: {response.text[:100]}")
                
        except requests.RequestException as e:
            return self.log_test("Quiz Submission", False, f"Request error: {str(e)}")
        except Exception as e:
            return self.log_test("Quiz Submission", False, f"Unexpected error: {str(e)}")

    def test_quiz_status_check(self):
        """Test quiz completion status check"""
        # Create and complete a quiz
        test_email = f"status_{uuid.uuid4().hex[:8]}@example.com"
        participant_data = {
            "nome": "Ana Status Teste",
            "email": test_email,
            "telefone": "(41) 98765-4321", 
            "endereco": "Rua Status, 33",
            "numero": "9",
            "cep": "80000-000"
        }
        
        try:
            # Register participant
            reg_response = requests.post(f"{self.base_url}/register", json=participant_data, timeout=10)
            if reg_response.status_code != 200:
                return self.log_test("Quiz Status Check", False, f"Failed to register: {reg_response.status_code}")
            
            # Check initial status (should be false)
            status_response = requests.get(f"{self.base_url}/quiz/check/{test_email}", timeout=10)
            
            if status_response.status_code != 200:
                return self.log_test("Quiz Status Check", False, f"Status check failed: {status_response.status_code}")
            
            initial_status = status_response.json()
            if initial_status.get("completado") != False:
                return self.log_test("Quiz Status Check", False, f"Initial status should be False, got {initial_status.get('completado')}")
            
            # Submit quiz
            quiz_data = {
                "email": test_email,
                "respostas": [0, 1, 2, 1, 2, 2, 1, 1, 1, 1]  # Some answers
            }
            
            submit_response = requests.post(f"{self.base_url}/quiz/submit", json=quiz_data, timeout=10)
            if submit_response.status_code != 200:
                return self.log_test("Quiz Status Check", False, f"Quiz submission failed: {submit_response.status_code}")
            
            # Check final status (should be true)
            final_status_response = requests.get(f"{self.base_url}/quiz/check/{test_email}", timeout=10)
            
            if final_status_response.status_code == 200:
                final_status = final_status_response.json()
                if final_status.get("completado") == True:
                    return self.log_test("Quiz Status Check", True, "Status correctly updated after completion")
                else:
                    return self.log_test("Quiz Status Check", False, f"Final status should be True, got {final_status.get('completado')}")
            else:
                return self.log_test("Quiz Status Check", False, f"Final status check failed: {final_status_response.status_code}")
                
        except requests.RequestException as e:
            return self.log_test("Quiz Status Check", False, f"Request error: {str(e)}")
        except Exception as e:
            return self.log_test("Quiz Status Check", False, f"Unexpected error: {str(e)}")

    def test_admin_login(self):
        """Test admin login functionality"""
        correct_credentials = {"username": "admin", "password": "admin123"}
        wrong_credentials = {"username": "admin", "password": "wrong"}
        
        try:
            # Test correct credentials
            response = requests.post(f"{self.base_url}/admin/login", json=correct_credentials, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "username" in data:
                    token_success = True
                    token = data["token"]
                else:
                    return self.log_test("Admin Login", False, "Missing token or username in response")
            else:
                return self.log_test("Admin Login", False, f"Valid credentials rejected: {response.status_code}")
            
            # Test wrong credentials
            wrong_response = requests.post(f"{self.base_url}/admin/login", json=wrong_credentials, timeout=10)
            
            if wrong_response.status_code == 401:
                return self.log_test("Admin Login", True, "Correct and incorrect credentials handled properly")
            else:
                return self.log_test("Admin Login", False, f"Wrong credentials should return 401, got {wrong_response.status_code}")
                
        except requests.RequestException as e:
            return self.log_test("Admin Login", False, f"Request error: {str(e)}")
        except Exception as e:
            return self.log_test("Admin Login", False, f"Unexpected error: {str(e)}")

    def test_admin_participants(self):
        """Test admin participants list"""
        try:
            response = requests.get(f"{self.base_url}/admin/participants", timeout=10)
            
            if response.status_code == 200:
                participants = response.json()
                
                if isinstance(participants, list):
                    if len(participants) > 0:
                        # Check structure of first participant
                        first_participant = participants[0]
                        required_fields = ["id", "nome", "email", "telefone", "endereco", "numero", "cep", "pontuacao", "completado"]
                        
                        if all(field in first_participant for field in required_fields):
                            return self.log_test("Admin Participants", True, f"Retrieved {len(participants)} participants with correct structure")
                        else:
                            missing_fields = [f for f in required_fields if f not in first_participant]
                            return self.log_test("Admin Participants", False, f"Missing fields: {missing_fields}")
                    else:
                        return self.log_test("Admin Participants", True, "Empty participants list (expected for fresh database)")
                else:
                    return self.log_test("Admin Participants", False, f"Expected list, got {type(participants)}")
            else:
                return self.log_test("Admin Participants", False, f"Status {response.status_code}: {response.text[:100]}")
                
        except requests.RequestException as e:
            return self.log_test("Admin Participants", False, f"Request error: {str(e)}")
        except Exception as e:
            return self.log_test("Admin Participants", False, f"Unexpected error: {str(e)}")

    def test_field_validation(self):
        """Test form field validation"""
        invalid_data_sets = [
            # Invalid phone
            {
                "nome": "Test User",
                "email": "test@example.com", 
                "telefone": "123",  # Too short
                "endereco": "Rua Test",
                "numero": "1",
                "cep": "12345678"
            },
            # Invalid CEP
            {
                "nome": "Test User",
                "email": "test2@example.com",
                "telefone": "(11) 99999-9999",
                "endereco": "Rua Test", 
                "numero": "1",
                "cep": "123"  # Too short
            },
            # Missing required field
            {
                "email": "test3@example.com",
                "telefone": "(11) 99999-9999",
                "endereco": "Rua Test",
                "numero": "1", 
                "cep": "12345678"
                # Missing nome
            }
        ]
        
        try:
            for i, invalid_data in enumerate(invalid_data_sets):
                response = requests.post(f"{self.base_url}/register", json=invalid_data, timeout=10)
                
                if response.status_code != 422 and response.status_code != 400:
                    return self.log_test("Field Validation", False, f"Test case {i+1}: Expected 400/422, got {response.status_code}")
            
            return self.log_test("Field Validation", True, "All invalid inputs properly rejected")
                
        except requests.RequestException as e:
            return self.log_test("Field Validation", False, f"Request error: {str(e)}")
        except Exception as e:
            return self.log_test("Field Validation", False, f"Unexpected error: {str(e)}")

    def run_all_tests(self):
        """Run all backend tests"""
        print("🧪 Starting PL Jovem Backend API Tests")
        print(f"📡 Testing endpoint: {self.base_url}")
        print("=" * 60)
        
        # Run all tests
        self.test_register_participant()
        self.test_duplicate_email()
        self.test_get_quiz_questions()
        self.test_quiz_submission()
        self.test_quiz_status_check()
        self.test_admin_login()
        self.test_admin_participants()
        self.test_field_validation()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = PLJovemAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())