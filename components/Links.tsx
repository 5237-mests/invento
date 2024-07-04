'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Links() {
  const [urls, setUrls] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    const splitedPath = pathname.split('/');
    // remove empty string
    const filteredPath = splitedPath.filter((path) => path !== '');
    setUrls(filteredPath);
  }, [pathname]);

  return (
    <div className="flex gap-2 p-2">
      {urls.map((url, index) => (
        <React.Fragment key={url}>
          {index > 0 && <span>/</span>}
          <Link
            href={`/${urls.slice(0, index + 1).join('/')}`}
            className={`text-blue-500 hover:text-blue-700 hover:underline`}
          >
            {url}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Links;
