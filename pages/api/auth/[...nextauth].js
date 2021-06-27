import NextAuth from 'next-auth';   
import Provider from 'next-auth/providers';
import {createConnection} from 'mysql2/promise';
import Password from 'node-php-password';

export default NextAuth({
    session:{
        jwt:true
    },
    providers: [
        Provider.Credentials({
            async authorize(credentials, req){
                const client = await createConnection({
                    user:'gK0PZY7s9a',
                    database:'gK0PZY7s9a',
                    host:'remotemysql.com',
                    password:'dwXKDVGrza',
                });
                if(credentials.admin){
                    const [rows, fields] = await client.execute("SELECT uid, name, email, userType, password FROM users_info WHERE email = ? AND userType = 0", [credentials.email]);
                    if(!rows[0]){
                        client.destroy();
                        throw new Error("User not found):");
                    }
                    if(!Password.verify(credentials.password, rows[0].password)){
                        client.destroy();
                        throw Error("Password or email is wrong!");
                    }
                    return {
                        email: rows[0].email,
                        name: {
                            id: rows[0].uid,
                            userType: rows[0].userType
                        }
                    }
                }
                if(credentials.moderator){
                    const [rows, fields] = await client.execute("SELECT uid, name, email, userType, password FROM users_info WHERE email = ? AND userType = 1", [credentials.email]);
                    if(!rows[0]){
                        client.destroy();
                        throw new Error("User not found):");
                    }
                    if(!Password.verify(credentials.password, rows[0].password)){
                        client.destroy();
                        throw Error("Password or email is wrong!");
                    }
                    return {
                        email: rows[0].email,
                        name: {
                            id: rows[0].uid,
                            userType: rows[0].userType
                        }
                    }
                }
            }
        }),
    ]
});