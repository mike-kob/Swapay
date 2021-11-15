import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import { ContactPhoneSharp } from '@material-ui/icons';

const I18Link = (props) => {
  const router = useRouter();
  const href = props.href === '/' ? '' : props.href;
  const updatedProps = {
    ...props,
    href: `/${router.query.lang || 'en'}${href}`,
  };

  console.log(updatedProps, 'PROPS')

  return (
    <Link {...updatedProps}>{props.children}</Link>
  );
};

export default I18Link;
