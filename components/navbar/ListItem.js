import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import {useRouter} from 'next/router';
import {getSession } from 'next-auth/client';
import generalActions from '../../stores/actions/generalActions';
import { useDispatch, useSelector } from 'react-redux';

const ListItem = ({arabic, list, idx, admin, session}) => {
    const router = useRouter();
    const dispatch = useDispatch();
    


    return <Fragment>
        {list.title == "My Info" || list.title == "معلوماتي" ?
            session && 
            <li>
                <Link href={list.link}>
                    <a>{list.title}</a>
                </Link>
            </li> : 
            list.title == "Requests" || list.title == "طلباتي" ?
            session &&
                <li>
                    <Link href={list.link}>
                        <a>{list.title}</a>
                    </Link>
                </li>
            :
            <li>
                {list.title == "Arabic" ? 
                <Link href={list.link + `/${router.pathname.slice(4)}`}>
                    <a>{list.title}</a>
                </Link>  
                : list.title == "انجليزي" ? 
                <Link href={list.link + `/en/${router.pathname.slice(4)}`}>
                    <a>{list.title}</a>
                </Link> 
                : <Link href={list.link}>
                    <a>{list.title}</a>
                </Link> }
            </li>
        }
    </Fragment>
} 


export default ListItem;