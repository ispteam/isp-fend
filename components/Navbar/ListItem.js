import Link from 'next/link';
import { Fragment } from 'react';
import {useRouter} from 'next/router';
const ListItem = ({unique, list}) => {
    const router = useRouter();
    return <Fragment>
        <li className="mt-8 md:mb-8">
            <Link href={list.link}>
                <a className={list.link == router.pathname ? "anchor-style-active" : "anchor-style"}>{list.title}</a>
            </Link>
        </li>
    </Fragment>
}


export default ListItem;