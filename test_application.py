#!/usr/bin/env python3
"""
Test script for SkinX Medical AI Platform
Tests all critical functionality without running the full server
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app_working_production import app, db, DISEASE_DATABASE

def test_database_initialization():
    """Test database initialization and demo data"""
    print("Testing Database Initialization...")
    
    # Test users exist
    assert db.get_user('admin@skinx.com') is not None, "Admin user not found"
    assert db.get_user('doctor@skinx.com') is not None, "Doctor user not found"
    assert db.get_user('patient@skinx.com') is not None, "Patient user not found"
    
    # Test patients exist for doctor
    doctor = db.get_user('doctor@skinx.com')
    patients = db.get_patients_by_user(doctor['id'])
    assert len(patients) > 0, "No demo patients found for doctor"
    
    print("  Database initialization: PASSED")

def test_disease_database():
    """Test disease database completeness"""
    print("Testing Disease Database...")
    
    # Test we have 55+ conditions
    assert len(DISEASE_DATABASE) >= 55, f"Expected 55+ diseases, found {len(DISEASE_DATABASE)}"
    
    # Test required fields exist for each disease
    required_fields = ['category', 'risk', 'severity', 'confidence_range', 'treatment', 'keywords', 'icd10', 'description']
    
    for disease, info in DISEASE_DATABASE.items():
        for field in required_fields:
            assert field in info, f"Missing field '{field}' in disease '{disease}'"
    
    # Test risk levels
    risk_levels = set(info['risk'] for info in DISEASE_DATABASE.values())
    expected_risks = {'Low', 'Medium', 'High'}
    assert risk_levels == expected_risks, f"Expected risk levels {expected_risks}, found {risk_levels}"
    
    print(f"  Disease Database: {len(DISEASE_DATABASE)} conditions - PASSED")

def test_analysis_functions():
    """Test AI analysis functions"""
    print("Testing Analysis Functions...")
    
    from app_working_production import analyze_image, analyze_text
    
    # Test image analysis
    disease_name, disease_info = analyze_image("test.jpg", "test_image.jpg")
    assert disease_name in DISEASE_DATABASE, f"Unknown disease: {disease_name}"
    assert 'confidence' in disease_info, "Missing confidence in image analysis"
    assert 'risk' in disease_info, "Missing risk in image analysis"
    
    # Test text analysis
    disease_name, disease_info = analyze_text("patient has red itchy skin")
    assert disease_name in DISEASE_DATABASE, f"Unknown disease: {disease_name}"
    assert 'confidence' in disease_info, "Missing confidence in text analysis"
    assert 'risk' in disease_info, "Missing risk in text analysis"
    
    print("  Analysis Functions: PASSED")

def test_routes_exist():
    """Test all required routes exist"""
    print("Testing Routes...")
    
    with app.test_client() as client:
        # Test main routes
        routes_to_test = [
            '/',
            '/login',
            '/signup',
            '/logout',
            '/dashboard',
            '/analysis',
            '/patients',
            '/api/stats',
            '/api/patients',
            '/api/analyses'
        ]
        
        for route in routes_to_test:
            try:
                response = client.get(route, follow_redirects=True)
                assert response.status_code in [200, 302, 405], f"Route {route} returned {response.status_code}"
            except Exception as e:
                print(f"  Route {route}: FAILED - {e}")
                return False
        
        print("  Routes: PASSED")

def test_api_endpoints():
    """Test API endpoints functionality"""
    print("Testing API Endpoints...")
    
    with app.test_client() as client:
        # Test login API
        login_data = {
            'email': 'admin@skinx.com',
            'password': 'demo123'
        }
        
        response = client.post('/api/login', 
                             data=json.dumps(login_data),
                             content_type='application/json')
        
        assert response.status_code == 200, f"Login API failed: {response.status_code}"
        
        login_result = response.get_json()
        assert login_result['success'] == True, "Login API returned failure"
        assert 'user' in login_result, "Missing user data in login response"
        
        # Test stats API (should work without login for testing)
        response = client.get('/api/stats')
        # Stats API requires login, so 302 redirect is expected
        assert response.status_code in [302, 401], f"Stats API unexpected status: {response.status_code}"
        
        print("  API Endpoints: PASSED")

def test_templates_exist():
    """Test all required templates exist"""
    print("Testing Templates...")
    
    template_files = [
        'login_production.html',
        'signup_production.html',
        'dashboard_production.html',
        'analysis_production.html',
        'patients_production.html'
    ]
    
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
    
    for template in template_files:
        template_path = os.path.join(templates_dir, template)
        assert os.path.exists(template_path), f"Template {template} not found"
    
    print("  Templates: PASSED")

def test_static_files():
    """Test static files exist"""
    print("Testing Static Files...")
    
    static_files = [
        'static/js/modern.js',
        'static/css/modern.css'
    ]
    
    for static_file in static_files:
        file_path = os.path.join(os.path.dirname(__file__), static_file)
        assert os.path.exists(file_path), f"Static file {static_file} not found"
    
    print("  Static Files: PASSED")

def main():
    """Run all tests"""
    print("=" * 60)
    print("SKINX MEDICAL AI PLATFORM - COMPREHENSIVE TESTS")
    print("=" * 60)
    
    tests = [
        test_database_initialization,
        test_disease_database,
        test_analysis_functions,
        test_routes_exist,
        test_api_endpoints,
        test_templates_exist,
        test_static_files
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
        except Exception as e:
            print(f"  FAILED: {e}")
            failed += 1
        print()
    
    print("=" * 60)
    print(f"TEST RESULTS: {passed} passed, {failed} failed")
    print("=" * 60)
    
    if failed == 0:
        print("ALL TESTS PASSED - Application is ready!")
        print("\nDemo Credentials:")
        print("  Admin:   admin@skinx.com / demo123")
        print("  Doctor:  doctor@skinx.com / demo123")
        print("  Patient: patient@skinx.com / demo123")
        print("\nFeatures:")
        print(f"  55+ Disease Conditions")
        print("  Risk Assessment (Low/Medium/High)")
        print("  Patient Management")
        print("  Real-time Analysis")
        print("  Professional UI")
        return True
    else:
        print(f"{failed} tests failed - Fix issues before deployment")
        return False

if __name__ == '__main__':
    import json
    success = main()
    sys.exit(0 if success else 1)
