We have 2 microservices (lambda functions)
location : C:\OrderProcessingSystem\src\functions
order-processing-service (handles all the APIs & acts as middleware)
inventory-validation(purely handles inventory validation)

run commands :
npx ts-node src/functions/order-processing-service/index.ts to run order processing service
npx ts-node E:\OrderProcessingSystem\src\functions\inventory-validation\inventoryValidation.ts to run inventory validation

I have added default inputs to run directly

PFB Architecture:
C:\OrderProcessingSystem\systemArchitecture.png
