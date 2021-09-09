import NextAuth from 'next-auth';   
import Provider from 'next-auth/providers';
import {createConnection} from 'mysql2/promise';
import Password from 'node-php-password';

// user:'gK0PZY7s9a',
// database:'gK0PZY7s9a',
// host:'remotemysql.com',
// password:'dwXKDVGrza',

export default NextAuth({
    session:{
        jwt:true
    },
    providers: [
        Provider.Credentials({
            async authorize(credentials, req){  
                const client = await createConnection({
                    user: "sql6435325",
                    database: "sql6435325",
                    host: "sql6.freesqldatabase.com",
                    password: "fseN4kDkzB",
                });
                if(credentials.admin){
                    const [rows, fields] = await client.execute("SELECT uid, name, email, userType FROM users_info INNER JOIN admins ON users_info.uid = admins.adminId WHERE enterId = ? AND userType = 0;", [credentials.enteryId]);
                    if(!rows[0]){
                        client.destroy();
                        throw new Error("User not found):");
                    }
                    return {
                        email: rows[0].email,
                        name: {
                            id: rows[0].uid,
                            userType: rows[0].userType
                        }
                    }
                }else if(credentials.moderator){
                    const [rows, fields] = await client.execute("SELECT uid, name, email, userType FROM users_info INNER JOIN moderators ON users_info.uid = moderators.moderatorId WHERE enterId = ? AND userType = 1;", [credentials.enteryId]);
                    if(!rows[0]){
                        client.destroy();
                        throw new Error("Moderator not found):");
                    }
                    return {
                        email: rows[0].email,
                        name: {
                            id: rows[0].uid,
                            userType: rows[0].userType
                        }
                    }
                }else if(credentials.client){
                    const [rows, fields] = await client.execute("SELECT uid, name, email, userType, password FROM users_info WHERE email = ? AND userType = 3", [credentials.email]);
                    if(!rows[0]){
                        client.destroy();
                        if(credentials.arabic){
                            throw new Error("!المستخدم غير موجود");
                        }
                        throw new Error("User not found):");
                    }
                    if(!Password.verify(credentials.password, rows[0].password)){
                        client.destroy();
                        if(credentials.arabic){
                            throw new Error("!الرقم السري او البريد خطأ");
                        }
                        throw Error("Password or email is wrong!");
                    }
                    return {
                        email: rows[0].email,
                        name: {
                            id: rows[0].uid,
                            userType: rows[0].userType
                        }
                    }
                }else if(credentials.supplier){
                    const [rows, fields] = await client.execute("SELECT users_info.uid, users_info.email, users_info.userType, users_info.password, suppliers.verified, suppliers.pref, suppliers.carsPref FROM users_info INNER JOIN suppliers ON suppliers.supplierId = users_info.uid WHERE users_info.email =? AND suppliers.verified = 1", [credentials.email]);
                    if(!rows[0]){
                        client.destroy();
                        if(credentials.arabic){
                            throw new Error("!الموّرد غير موجود");
                        }
                        throw new Error("Supplier is not found):");
                    }
                    if(!Password.verify(credentials.password, rows[0].password)){
                        client.destroy();
                        if(credentials.arabic){
                            throw new Error("!الرقم السري او البريد خطأ");
                        }
                        throw Error("Password or email is wrong!");
                    }
                    return {
                        email: rows[0].email,
                        name: {
                            id: rows[0].uid,
                            userType: rows[0].userType,
                            pref: rows[0].pref,
                            carsPref: rows[0].carsPref
                        }
                    }
                }
            }
        }),
    ]
});