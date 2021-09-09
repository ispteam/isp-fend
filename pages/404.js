import Image from 'next/image';
const NotFound = () => {
    return <div>
        <Image src={"/imgs/404.jpg"} layout='responsive' width="80" height="80" />
    </div>
}

export default NotFound