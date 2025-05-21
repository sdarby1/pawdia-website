import { signIn } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const ProviderContainer = () => {
  return (
    <div className='provider-link-ct'>
      <Link href="/" onClick={() => signIn('google')} className="provider-auth-link">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8028.15 8191.98">
          <defs>
          </defs>
          <g id="Ebene_1" data-name="Ebene 1" image-rendering="optimizeQuality" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
            <path className="google-icon-path-1" d="M8028.15,4186.99c0-336.79-27.33-582.55-86.46-837.4h-3845.71v1520.05h2257.33c-45.49,377.76-291.25,946.64-837.4,1328.92l-7.64,50.9,1215.92,941.97,84.25,8.41c773.68-714.52,1219.71-1765.84,1219.71-3012.85Z"/>
            <path className="google-icon-path-2" d="M4095.99,8191.98c1105.9,0,2034.31-364.09,2712.46-992.13l-1292.53-1001.28c-345.88,241.21-810.1,409.61-1419.93,409.61-1083.16,0-2002.48-714.5-2330.2-1702.09l-48.02,4.08-1264.36,978.49-16.54,45.96c673.56,1338.02,2057.11,2257.36,3659.12,2257.36Z"/>
            <path className="google-icon-path-3" d="M1765.79,4906.09c-86.46-254.85-136.52-527.94-136.52-810.1s50.04-555.25,131.97-810.1l-2.29-54.29-1280.19-994.22-41.88,19.93C159.28,2812.55,0,3436.05,0,4095.96s159.3,1283.38,436.89,1838.63l1328.92-1028.53-.02.02Z"/>
            <path className="google-icon-path-4" d="M4095.99,1583.75c769.13,0,1287.93,332.24,1583.78,609.88l1155.98-1128.68C6125.8,405.04,5201.88,0,4095.99,0,2493.98,0,1110.44,919.32,436.86,2257.33l1324.38,1028.58c332.27-987.59,1251.58-1702.14,2334.75-1702.14v-.02Z"/>
          </g>
        </svg>
        <p>Mit Google anmelden</p>
      </Link>
      <Link href="/" onClick={() => signIn('github')} className="provider-auth-link">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 62.43">
          <defs>
          </defs>
          <g id="Ebene_1" data-name="Ebene 1" image-rendering="optimizeQuality" shape-rendering="geometricPrecision" text-rendering="geometricPrecision">
            <path className='github-icon-path-1' d="M32,.01C14.33.01,0,14.34,0,32.01c0,14.14,9.17,26.13,21.88,30.36,1.6.3,2.19-.7,2.19-1.54,0-.76-.03-3.28-.04-5.96-8.9,1.94-10.78-3.78-10.78-3.78-1.46-3.7-3.55-4.68-3.55-4.68-2.9-1.99.22-1.94.22-1.94,3.21.22,4.9,3.3,4.9,3.3,2.86,4.89,7.49,3.48,9.31,2.66.29-2.07,1.11-3.48,2.03-4.28-7.11-.81-14.58-3.55-14.58-15.81,0-3.49,1.25-6.35,3.3-8.59-.33-.81-1.43-4.06.31-8.47,0,0,2.69-.86,8.8,3.28,2.55-.71,5.29-1.06,8.01-1.08,2.72.01,5.46.37,8.02,1.08,6.11-4.14,8.79-3.28,8.79-3.28,1.74,4.41.65,7.66.32,8.47,2.05,2.24,3.29,5.1,3.29,8.59,0,12.29-7.49,14.99-14.61,15.79,1.15.99,2.17,2.94,2.17,5.92,0,4.28-.04,7.73-.04,8.78,0,.85.58,1.85,2.2,1.54,12.71-4.24,21.86-16.23,21.86-30.36C64,14.33,49.67,0,32,0h0s0,.01,0,.01Z"/>
          </g>
        </svg>
        <p>Mit Github anmelden</p>
      </Link>
    </div>
  )
}

export default ProviderContainer