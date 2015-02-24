    sqlite3 fp.db < schema.sql
    node seed.js
    node fp_server.js

Then proceed to `http://localhost:3000` and try to register.