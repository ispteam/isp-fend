import nodemailer from 'nodemailer';

const sendEmail = async (req, res) => {
    try{

        if(req.method != "POST"){
            const error = new Error();
            error.message = "You're unable to access to this page";
            error.statusCode = 421;
            throw error;
        }

        const {recepient, method, user, arabic, rememberToken, requestNum, shipperName, trackingNumber, reason} = req.body;

        let transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'isp.spare.isp@gmail.com',
                pass:'ISPisp123456789'
            }
        });

        let email;
        const from = "isp.spare.isp@gmail.com"

        if(method == "registration" && user== "client" ){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"ISP Registration",
                html: `<div style='border:1px solid black; padding:20px; margin:auto;'>
                        <h1 style='color=green; margin-bottom:10px'>Thank You For registration!</h1>
                        <h1>We're glad to be with us in our team</h1>
                        <h3>HAPPY ORDER :)</h3>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                    </div>
                        `,
            });
        }else if(method == "registration" && user== "client" && arabic ){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"ISP Registration",
                html: `<div style='border:1px solid black; padding:20px; margin:auto;'>
                        <h1 style='color=green; margin-bottom:10px'>شكرا لتسجيلك</h1>
                        <h1>سعيدين لكونك معنا</h1>
                        <h3>رحلة ممتعة</h3>
                        <p>اطيب التحيات</p>
                        <p>ISP فريق</p>
                    </div>
                        `,
            });
        }else if(method == "registration" && user== "supplier" ){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"ISP Registration",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>Thank You For registration!</h1>
                        <h2>We'll process revising your certificate.</h2> 
                        <h3>We will inform you as soon as possible.</h3>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                        <p>------------------</p>
                        <h1 style='color=green; margin-bottom:10px'>شكرا لتسجيلك معنا</h1>
                        <h2>نعمل على مراجعة الشهادة المرفقة</h2> 
                        <h3>سنبلغك في اقرب فرصة</h3>
                        <p>اطيب التحايا</p>
                        <p>ISP فريق</p>
                    </div>
                        `,
            });
        }else if(method == "registration" && user== "moderator" || method == "verified" && user== "supplier" ){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"ISP Registration",
                html: `<div style='border:1px solid black; padding:5px;'>
                        <h1 style='color=green; margin-bottom:10px'>Welcome in our family!</h1>
                        <h2>We're happy to be with us in our team.</h2> 
                        <h3>We're Looking forward to growing up together ^___^</h3>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                        <h1>------------------</h1>
                        <h1 style='color=green; margin-bottom:10px'>نرحب بك في عائلتنا</h1>
                        <h2>سعيدون لانضمام لفريقنا</h2> 
                        <h3>نأمل في ان ننمو سويا</h3>
                        <p>اطيب التحايا</p>
                        <p>ISP فريق</p>
                    </div>
                        `,
            });
        }else if(method == "notVerified" && user== "supplier" ){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"ISP Registration",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>Sorry to tell you that</h1>
                        <h2>We're sorry, your account has been revised and not meet the criteria.</h2> 
                        <h3>We're waiting you in other situations</h3>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                        <h1>------------------</h1>
                        <h1 style='color=green; margin-bottom:10px'>نأسف لإخبارك</h1>
                        <h2>تم مراجعة الشهادة ولم يتطابق مع الشروط</h2> 
                        <h3>بانتظارك في المرة القادمة</h3>
                        <p>اطيب التحايا</p>
                        <p>ISP فريق</p>
                    </div>
                        `,
            });
        }else if(method == "suspend" && user== "supplier" ){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"ISP Registration",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>Sorry to speak up that</h1>
                        <h2>We're sorry, your account has been suspended</h2> 
                        <h3>If there is something wrong, please contact us</h3>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                        <h1>------------------</h1>
                        <h1 style='color=green; margin-bottom:10px'>نأسف لإخبارك</h1>
                        <h2>تم تجميد حسابك</h2> 
                        <h3>اذا كان هنالك شيء خاطئ، من فضلك تواصل معنا</h3>
                        <p>اطيب التحايا</p>
                        <p>ISP فريق</p>
                    </div>
                        `,
            });
        }else if(method == "paid" && user== "client" && !arabic ){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"Payment notification",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>Woow, Your payment has beed succeed</h1>
                        <h2>Supplier will move the part to the shipper as soon as possible</h2>
                        <h3 style='color=red;'>rRequest Number number ${requestNum}</h3>
                        <h3>We'll update you with your shipping.</h3>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                    </div>
                        `,
            });
        }else if(method == "paid" && user== "client" && arabic ){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"اشعار بالدفع",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>رائع، عملية الدفع تمت بنجاح</h1>
                        <h2>سيتم ارسال الشحنة الى شركة الشحن في اقرب وقت</h2>
                        <h3 style='color=red;'>${requestNum} رقم الطلب </h3>
                        <h3>سنخبرك بتفاصيل الشحنة</h3>
                        <p>اطيب التحيات</p>
                        <p>ISP فريق</p>
                    </div>
                        `,
            });
        }else if(method == "paid" && user== "supplier"){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"Payment notification",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>Woow, Your offer is the best</h1>
                        <h2>You have been chosen for this order number <span style='color=red;'>${requestNum}</span></h2>
                        <h3>Please move the shipment to the shipper as soon as possible.</h3>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                        <h1>------------------</h1>
                        <h1 style='color=green; margin-bottom:10px'>رائع، عرضك هو الافضل</h1>
                        <h2>${requestNum} تم اختيارك للطلب رقم </h2> 
                        <h3>من فضلك قم بتمرير الطلب الى شركة الشحن في اقرب وقت ممكن</h3>
                        <p>اطيب التحايا</p>
                        <p>ISP فريق</p>
                    </div>`,
            });
        }else if(method == "password" && user== "all" && !arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"ISP Registration",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>You have requested to change your account password</h1>
                        <h2>please click on the link below to change your account password</h2> 
                        <a href='http://localhost:3000/en/auth/change-password/${rememberToken}'>Click here</a>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                    </div>`,
            });
        }else if(method == "password" && user== "all" && arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"ISP Registration",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>لقد طلبت تغيير كلمة المرور الخاصة بحسابك</h1>
                        <h2>من فضلك اضغط على الرابط في الاسفل لتغيير كلمة المرور</h2> 
                        <a href='http://localhost:3000/auth/change-password/${rememberToken}'>اضغط هنا</a>
                        <p>اطيب التحيات</p>
                        <p>ISP فريق</p>
                    </div>`,
            });
        }else if(method == "shipping" && user== "client" && !arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"Shipment notification",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>WOOOW, Your shipment with number <span style='color=red;'>${requestNum}</span> has been passed to the shipper</h1>
                        <h2>Shipping by ${shipperName} with tracking number ${trackingNumber}</h2>
                        <h2>It will arrive soon.</h2> 
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                    </div>`,
            });
        }else if(method == "shipping" && user== "client" && arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"اشعار حول الشحنة",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>لقد تم تمرير الشحنة الى شركة الشحن لرقم الطلب <span style='color=red;'>${requestNum}</span></h1>
                        <h3 style='color=green; margin-bottom:10px'><span style='color=red;'>${shipperName}</span> شركة الشحن</h3>
                        <h3 style='color=green; margin-bottom:10px'>رقم التتبع <span style='color=red;'>${trackingNumber}</span></h3>
                        <h2>ستصلك الشحنة قريبا</h2> 
                        <p>اطيب التحيات</p>
                        <p>ISP فريق</p>
                    </div>`,
            });
        }else if(method == "cancelShipping" && user== "supplier" && !arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"Shipment notification",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>Sorry, Your assigned request number <span style='color=red;'>${requestNum}</span> has been canceled</h1>
                        <h2>Be patient</h2> 
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                        <h1>------------------</h1>
                        <h1 style='color=green; margin-bottom:10px'> تم الغاوه ${requestNum} نأسف لإخبارك، الطلب رقم</h1>
                        <h2>كن صبورا</h2> 
                        <p>اطيب التحايا</p>
                        <p>ISP فريق</p>
                    </div>`,
            });
        }else if(method == "offer" && user== "client" && !arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"Offers notifications",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>WOOOW, You have a new offer for your order <span style='color=red;'>${requestNum}</span></h1>
                        <h2>Please look at the submitted offer</h2> 
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                    </div>`,
            });
        }else if(method == "offer" && user== "client" && arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"اشعارات العروض",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>لديك عرض جديد على طلبك <span style='color=red;'>${requestNum}</span></h1>
                        <h2>من فضلك راجع العرض المقدم</h2> 
                        <p>اطيب التحيات</p>
                        <p>ISP فريق</p>
                    </div>`,
            });
        }else if(method == "cancelSupplier" && user== "client" && !arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"Shipment notification",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>Sorry, the supplier has cacneled the submitted offer for order <span style='color=red;'>${requestNum}</span></h1>
                        <h3>Reason: ${reason.split(' - ')[0]} </h3>
                        <h2>Be patient</h2> 
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                    </div>`,
            });
        }else if(method == "cancelSupplier" && user== "client" && arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"اشعارات العروض",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>نأسف لاخبارك هذا، الموّرد الغى العرض المقدم لرقم الطلب <span style='color=red;'>${requestNum}</span></h1>
                        <h3>السبب</h3>
                        <h3>${reason.split(' - ')[1]}</h3>
                        <h2>كن صبورا</h2> 
                        <p>اطيب التحيات</p>
                        <p>ISP فريق</p>
                    </div>`,
            });
        }else if(method == "refund" && user== "client" && !arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"Payment notification",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>Refund money for request number <span style='color=red;'>${requestNum}</span> is processing now to your account</h1>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                    </div>`,
            });
        }else if(method == "refund" && user== "client" && arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"اشعارات الدفع",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>لقد تم اعتماد اعادة المبلغ لحسابكم لرقم الطلب <span style='color=red;'>${requestNum}</span></h1>
                        <p>اطيب التحيات</p>
                        <p>ISP فريق</p>
                    </div>`,
            });
        }else if(method=="addRequest" && user=="client" && !arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"New Request",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>Your new request has been added successfully</h1>
                        <h2>We hope your request done successfully</h2>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                    </div>`,
            });
        }else if(method=="addRequest" && user=="client" && arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"'طلب جديد'",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>لقد تم اضافة الطلب بنجاح</h1>
                        <h2>نتمنى ان يتم الطلب باسرع وقت ممكن</h2>
                        <p>اطيب التحيات</p>
                        <p>ISP فريق</p>
                    </div>`,
            });
        }else if(method=="addRequest" && user=="supplier"){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"New Request",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>A new request has been added</h1>
                        <h2>We believe you will give the best price</h2>
                        <h2>We hope you succeed</h2>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                        <h1>------------------</h1>
                        <h1 style='color=green; margin-bottom:10px'>تم اضافة طلب جديد</h1>
                        <h3>نأمل مراجعة العرض وتقديم السعر الافضل</h3>
                        <p>اطيب التحايا</p>
                        <p>ISP فريق</p>
                    </div>`,
            });
        }else if(method == "complete" && user== "client" && arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"اشعار حول الشحنة",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>لقد تم توصيل الطلب لرقم <span style='color=red;'>${requestNum}</span></h1>
                        <h3 style='color=green; margin-bottom:10px'>رقم التتبع <span style='color=red;'>${trackingNumber}</span></h3>
                        <h2>ستصلك الشحنة قريبا</h2> 
                        <p>اطيب التحيات</p>
                        <p>ISP فريق</p>
                    </div>`,
            });
        }else if(method == "complete" && user== "client" && !arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"Shipment notification",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>WOOOW, Your shipment with number <span style='color=red;'>${requestNum}</span> has been delivered</h1>
                        <h2>Tracking number ${trackingNumber}</h2>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                    </div>`,
            });
        }else if(method == "rejectOffer" && user== "supplier" && !arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"Offer notification",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>Sorry, Your offer with number <span style='color=red;'>${requestNum}</span> has been rejected</h1>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                        <h1>------------------</h1>
                        <h1 style='color=green; margin-bottom:10px'> تم رفضه ${requestNum} نأسف لإخبارك، عرضك المقدم للطلب رقم</h1>
                        <p>اطيب التحايا</p>
                        <p>ISP فريق</p>
                    </div>`,
            });
        }else if(method == "acceptUpdate" && user== "supplier" && !arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"Update profile",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>Your request to update profile has been accepted</h1>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                        <h1>------------------</h1>
                        <h1 style='color=green; margin-bottom:10px'>تم قبول طلبك لتحديث بياناتك</h1>
                        <p>اطيب التحايا</p>
                        <p>ISP فريق</p>
                    </div>`,
            });
        }else if(method == "rejectUpdate" && user== "supplier" && !arabic){
            email = await transporter.sendMail({
                from:from,
                to: recepient,
                subject:"Update profile",
                html: `<div style='border:1px solid black; padding:5px'>
                        <h1 style='color=green; margin-bottom:10px'>Your request to update profile has been rejected</h1>
                        <p>BEST REGARDS</p>
                        <p>ISP TEAM</p>
                        <h1>------------------</h1>
                        <h1 style='color=green; margin-bottom:10px'>تم رفض طلبك لتحديث بياناتك</h1>
                        <p>اطيب التحايا</p>
                        <p>ISP فريق</p>
                    </div>`,
            });
        }
    
        if(email.rejected.length > 0){
           const error = new Error();
           error.message = "There is something wrong during sending the email";
           error.statusCode = 500;
           throw error;
        }
    }catch(err){
        return res.status(err.statusCode).json({
            message: err.message,
            statusCode: err.statusCode
        })
    }

    return res.status(200).json({
        message: "SENT"
    });
}


export default sendEmail