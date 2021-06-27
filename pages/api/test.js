import Password from 'node-php-password';
const test = (req, res) => {
    if(Password.verify("AZZOZz123456789", '$2y$10$0VfziZLORS1IGiOokbsx5evNTqXwGPXyYrzwOoObQFHzKRcV/0FTm')){
        return res.status(404).json({
            message: "equal"
        })
    }
    return res.status(404).json({
        message: "not"
    })
}

export default test;