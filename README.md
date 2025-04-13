# An Express Server Template# Backend Skill Checkpoint – TechUp

โปรเจกต์นี้เป็นส่วนหนึ่งของการสอบ Backend Skill Checkpoint โดย TechUp 
ซึ่งมีวัตถุประสงค์เพื่อสร้าง RESTful API สำหรับระบบถาม-ตอบที่คล้ายกับ Quora โดยใช้ Express.js และฐานข้อมูล PostgreSQL พร้อมทั้งจัดทำเอกสาร API ด้วย Swagger

## 📌 ฟีเจอร์หลัก

- **คำถาม (Questions):**
  - สร้างคำถามใหม่พร้อมหัวข้อ คำอธิบาย และหมวดหมู่ (เช่น Software, Food, Travel, Science, Etc.)
  - ดูคำถามทั้งหมดหรือเฉพาะคำถามที่ระบุด้วย ID
  - แก้ไขหัวข้อหรือคำอธิบายของคำถาม
  - ลบคำถาม (พร้อมลบคำตอบที่เกี่ยวข้อง)
  - ค้นหาคำถามโดยใช้หัวข้อหรือหมวดหมู่
  - โหวตคำถาม (เห็นด้วย/ไม่เห็นด้วย)

- **คำตอบ (Answers):**
  - เพิ่มคำตอบให้กับคำถามที่ระบุ (จำกัดความยาวไม่เกิน 300 ตัวอักษร)
  - ดูคำตอบทั้งหมดของคำถามที่ระบุ
  - ลบคำตอบทั้งหมดของคำถามที่ระบุ
  - โหวตคำตอบ (เห็นด้วย/ไม่เห็นด้วย)

## 🛠️ เทคโนโลยีที่ใช้

- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL
- **API Documentation:** Swagger (ผ่าน Swagger UI)
- **Testing Tool:** Postman

## ⚙️ การติดตั้งและใช้งาน

1. **โคลนโปรเจกต์:**
   ```bash
   git clone https://github.com/Nantasit-2001/backend-skill-checkpoint.git
   cd backend-skill-checkpoint
2. **ติดตั้ง Dependencies:**
    ```bash
    npm install
3. **ตั้งค่าฐานข้อมูล:**
     - สร้างฐานข้อมูล PostgreSQL
    รัน SQL Script เพื่อสร้างตารางและข้อมูลเบื้องต้น: [quora-mock.sql](https://gist.github.com/napatwongchr/811ef7071003602b94482b3d8c0f32e0)
4. **กำหนดค่า Environment Variables:**
     - กำหนดค่า POST (ในที่นี้ใช้ 4000)
     - ตั้งค่า `connectionString` สำหรับเชื่อมต่อฐานข้อมูล PostgreSQL ในไฟล์ `utils/db.mjs` ให้อยู่ในรูปแบบ:
     `postgresql://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME`
     - DB_USER=your_username
     - DB_PASSWORD=your_password
     - DB_HOST=localhost
     - DB_PORT=5432
     - DB_NAME=your_database_name
     ```bash
     "postgresql://postgres:postgres@localhost:5432/SkillCheckPoint Back-End"
      
5. **เริ่มต้นเซิร์ฟเวอร์:**
    ```bash
    npm run start
6. **เข้าถึง Swagger UI:**
    - เปิดเบราว์เซอร์และไปที่: http://localhost:4000/api-docs

## 🧪 การทดสอบ API

 - ใช้ Postman เพื่อทดสอบ API โดย:
 - นำเข้า Collection:
 - สร้าง Collection ใหม่ใน Postman
 - เพิ่ม Request ตามที่กำหนดใน API Documentation
 - ทดสอบ Endpoint ต่าง ๆ:
 - GET /questions: ดึงคำถามทั้งหมด
 - POST /questions: สร้างคำถามใหม่
 - PUT /questions/:id: แก้ไขคำถาม
 - DELETE /questions/:id: ลบคำถาม
 - GET /questions/search?title=...&category=...: ค้นหาคำถาม
 - POST /questions/:id/answers: เพิ่มคำตอบ
 - GET /questions/:id/answers: ดึงคำตอบของคำถาม
 - DELETE /questions/:id/answers: ลบคำตอบของคำถาม
 - POST /questions/:id/vote: โหวตคำถาม
 - POST /answers/:id/vote: โหวตคำตอบ

## 📄 เอกสาร API
  เอกสาร API ถูกสร้างขึ้นด้วย Swagger และสามารถเข้าถึงได้ที่:
 http://localhost:4000/api-docs

## 👨‍💻 ผู้พัฒนา
 nantasit - [GitHub Profile](https://github.com/Nantasit-2001)
