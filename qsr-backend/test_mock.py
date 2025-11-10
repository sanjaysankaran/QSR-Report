#!/usr/bin/env python3
"""
Quick test script to verify mock data functionality
"""

import requests
import json
import sys

def test_backend():
    base_url = "http://localhost:8000"
    
    print("🧪 Testing QSR Backend Mock Data Functionality\n")
    
    # Test 1: Check status
    try:
        print("1️⃣ Checking backend status...")
        response = requests.get(f"{base_url}/api/v1/qsr/status")
        
        if response.status_code == 200:
            status = response.json()
            print(f"   ✅ Status: {status['status']}")
            print(f"   📊 Data Source: {status['data_source']}")
            print(f"   🔑 Kissflow Configured: {status['kissflow_configured']}")
        else:
            print(f"   ❌ Status check failed: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Backend not running! Start it with: python run.py")
        return False
    
    # Test 2: Fetch mock data
    print("\n2️⃣ Testing data fetch...")
    try:
        payload = {"item_id": "KFF-0111"}
        response = requests.post(
            f"{base_url}/api/v1/qsr/fetch-data",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Data fetch successful")
            print(f"   📋 Feature: {data['data'].get('FeatureName', 'N/A')}")
            print(f"   👥 Team: {data['data'].get('TeamName', 'N/A')}")
            print(f"   📅 Quarter: {data['data'].get('QuarterRelease', 'N/A')}")
            print(f"   ⚠️  Missing Fields: {len(data['missingFields'])}")
            
            # Show some missing fields
            if data['missingFields']:
                print(f"   🔍 Examples: {', '.join(data['missingFields'][:3])}...")
                
        else:
            print(f"   ❌ Data fetch failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False
    
    # Test 3: Invalid item ID
    print("\n3️⃣ Testing invalid item ID...")
    try:
        payload = {"item_id": "INVALID-123"}
        response = requests.post(
            f"{base_url}/api/v1/qsr/fetch-data",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 400:
            print("   ✅ Correctly rejected invalid item ID")
        else:
            print(f"   ⚠️  Unexpected response: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
    
    print("\n🎉 Backend tests completed!")
    return True

if __name__ == "__main__":
    success = test_backend()
    sys.exit(0 if success else 1)