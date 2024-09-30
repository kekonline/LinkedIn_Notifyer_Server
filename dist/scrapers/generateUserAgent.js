"use strict";
const agents = [
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.2; WOW64) AppleWebKit/533.6 (KHTML, like Gecko) Chrome/49.0.1325.232 Safari/601.1 Edge/8.85084"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 10.2; x64; en-US) AppleWebKit/602.49 (KHTML, like Gecko) Chrome/54.0.3930.133 Safari/603"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 7.0; Windows; Windows NT 6.0; Win64; x64 Trident/4.0)"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 7.0; Windows; U; Windows NT 6.2; x64; en-US Trident/4.0)"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 7.1; LG-H930 Build/NRD90M) AppleWebKit/535.13 (KHTML, like Gecko) Chrome/54.0.2403.375 Mobile Safari/533.1"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.0;) AppleWebKit/602.37 (KHTML, like Gecko) Chrome/49.0.3362.351 Safari/601"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 6.2; WOW64; en-US) AppleWebKit/536.7 (KHTML, like Gecko) Chrome/50.0.1350.146 Safari/601.0 Edge/11.55478"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.5; Win64; x64) AppleWebKit/535.18 (KHTML, like Gecko) Chrome/55.0.1582.265 Safari/602"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Linux; Linux i672 ; en-US) AppleWebKit/603.31 (KHTML, like Gecko) Chrome/47.0.2494.113 Safari/534"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 8_8_3; like Mac OS X) AppleWebKit/535.47 (KHTML, like Gecko) Chrome/49.0.3302.308 Mobile Safari/534.2"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_9; like Mac OS X) AppleWebKit/534.1 (KHTML, like Gecko) Chrome/47.0.2231.371 Mobile Safari/536.9"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_5_1; like Mac OS X) AppleWebKit/602.28 (KHTML, like Gecko) Chrome/49.0.3998.216 Mobile Safari/601.4"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1;) AppleWebKit/602.14 (KHTML, like Gecko) Chrome/50.0.3296.259 Safari/536.8 Edge/16.29055"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 8_6_3; like Mac OS X) AppleWebKit/534.40 (KHTML, like Gecko) Chrome/53.0.1289.333 Mobile Safari/537.1"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (U; Linux x86_64) Gecko/20100101 Firefox/54.7"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (Android; Android 7.1; Pixel C Build/NME91E) AppleWebKit/600.1 (KHTML, like Gecko) Chrome/54.0.2158.108 Mobile Safari/603.7"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.3; WOW64) AppleWebKit/534.32 (KHTML, like Gecko) Chrome/52.0.1874.334 Safari/602.6 Edge/17.59420"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_11_5; en-US) AppleWebKit/603.13 (KHTML, like Gecko) Chrome/48.0.3231.306 Safari/603"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/600.26 (KHTML, like Gecko) Chrome/52.0.3644.156 Safari/603"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_4_7; en-US) Gecko/20130401 Firefox/51.0"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux i561 x86_64; en-US) AppleWebKit/603.14 (KHTML, like Gecko) Chrome/49.0.2293.381 Safari/600"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (iPad; CPU iPad OS 8_7_7 like Mac OS X) AppleWebKit/602.11 (KHTML, like Gecko) Chrome/47.0.1661.116 Mobile Safari/603.5"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (U; Linux x86_64; en-US) AppleWebKit/600.37 (KHTML, like Gecko) Chrome/51.0.3227.225 Safari/600"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 5.0.2; HTC Butterfly S 901s Build/LRX22G) AppleWebKit/535.34 (KHTML, like Gecko) Chrome/50.0.3003.251 Mobile Safari/601.7"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 6.2; x64; en-US) Gecko/20100101 Firefox/48.7"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 5.1.1; MOTOROLA MOTO E XT1021 Build/LMY47Z) AppleWebKit/602.31 (KHTML, like Gecko) Chrome/50.0.1775.331 Mobile Safari/534.6"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 8.0; Windows; U; Windows NT 6.2;; en-US Trident/4.0)"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Android; Android 5.1; Nexus 8 Build/LMY48B) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/51.0.2746.324 Mobile Safari/533.9"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.3;) AppleWebKit/534.2 (KHTML, like Gecko) Chrome/48.0.2511.237 Safari/600.1 Edge/8.17756"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_6_4; like Mac OS X) AppleWebKit/601.43 (KHTML, like Gecko) Chrome/53.0.2602.171 Mobile Safari/534.4"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) Gecko/20130401 Firefox/66.6"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.3; Win64; x64) AppleWebKit/533.11 (KHTML, like Gecko) Chrome/51.0.1751.385 Safari/536.5 Edge/9.80047"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux x86_64) Gecko/20130401 Firefox/56.9"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 8_5_8) Gecko/20100101 Firefox/60.6"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_2_5) AppleWebKit/535.3 (KHTML, like Gecko) Chrome/49.0.2675.168 Safari/533"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3; en-US) Gecko/20100101 Firefox/55.1"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 10.5; x64; en-US) AppleWebKit/534.17 (KHTML, like Gecko) Chrome/48.0.2000.375 Safari/600"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; Android 5.0.2; Nokia 1000 wifi Build/GRK39F) AppleWebKit/601.6 (KHTML, like Gecko) Chrome/49.0.3588.204 Mobile Safari/535.5"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Linux; Linux i545 ; en-US) Gecko/20130401 Firefox/54.6"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Android; Android 5.0.1; SAMSUNG SM-A700T Build/LMY47X) AppleWebKit/600.35 (KHTML, like Gecko) Chrome/53.0.3285.206 Mobile Safari/601.1"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.3; Win64; x64; en-US) AppleWebKit/602.50 (KHTML, like Gecko) Chrome/48.0.3981.229 Safari/601.8 Edge/16.72168"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.1; WOW64; en-US) AppleWebKit/602.32 (KHTML, like Gecko) Chrome/54.0.1424.310 Safari/533.3 Edge/13.14982"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.3; x64) AppleWebKit/533.1 (KHTML, like Gecko) Chrome/54.0.2858.282 Safari/601"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.2; x64) AppleWebKit/533.11 (KHTML, like Gecko) Chrome/51.0.1833.244 Safari/535"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.3; WOW64; en-US) AppleWebKit/601.44 (KHTML, like Gecko) Chrome/47.0.2129.235 Safari/600.8 Edge/14.38098"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (U; Linux x86_64) Gecko/20130401 Firefox/67.4"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 10.1; WOW64; en-US) Gecko/20100101 Firefox/74.0"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.3;; en-US) AppleWebKit/534.40 (KHTML, like Gecko) Chrome/51.0.2863.162 Safari/600.1 Edge/16.23232"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0_7; like Mac OS X) AppleWebKit/603.41 (KHTML, like Gecko) Chrome/53.0.3124.102 Mobile Safari/537.8"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; Android 4.4.4; E:number:20-23:34 Build/24.0.B.1.34) AppleWebKit/602.18 (KHTML, like Gecko) Chrome/49.0.2294.328 Mobile Safari/602.1"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.0; WOW64) AppleWebKit/536.26 (KHTML, like Gecko) Chrome/48.0.3820.170 Safari/537"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows; U; Windows NT 6.3; WOW64; en-US Trident/5.0)"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux x86_64) Gecko/20100101 Firefox/63.5"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.5;; en-US) AppleWebKit/537.44 (KHTML, like Gecko) Chrome/55.0.1407.167 Safari/602.5 Edge/8.34826"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 5.1; SAMSUNG SM-G920X Build/LMY47X) AppleWebKit/600.11 (KHTML, like Gecko) Chrome/48.0.1085.127 Mobile Safari/537.9"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_4_8; like Mac OS X) AppleWebKit/603.48 (KHTML, like Gecko) Chrome/54.0.2873.178 Mobile Safari/601.3"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Android; Android 7.1; SAMSUNG GT-I9800 Build/KTU84P) AppleWebKit/602.7 (KHTML, like Gecko) Chrome/52.0.3049.295 Mobile Safari/533.1"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_3_5; like Mac OS X) AppleWebKit/536.9 (KHTML, like Gecko) Chrome/49.0.2124.120 Mobile Safari/534.6"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 8_1_6; like Mac OS X) AppleWebKit/534.21 (KHTML, like Gecko) Chrome/51.0.3159.216 Mobile Safari/603.3"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.2;) Gecko/20130401 Firefox/53.2"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_1) Gecko/20100101 Firefox/69.6"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; Android 5.1; SM-G928M Build/LRX22G) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/49.0.2566.220 Mobile Safari/603.2"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4_8; like Mac OS X) AppleWebKit/600.46 (KHTML, like Gecko) Chrome/48.0.2161.276 Mobile Safari/535.3"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 8_1_2) Gecko/20130401 Firefox/51.3"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0;) AppleWebKit/601.34 (KHTML, like Gecko) Chrome/48.0.1138.115 Safari/533.2 Edge/10.32672"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 6.0; Nexus 5X Build/MDB08L) AppleWebKit/534.32 (KHTML, like Gecko) Chrome/53.0.2670.267 Mobile Safari/537.7"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.2;) AppleWebKit/600.16 (KHTML, like Gecko) Chrome/52.0.3474.111 Safari/603"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_7; like Mac OS X) AppleWebKit/601.44 (KHTML, like Gecko) Chrome/47.0.1836.284 Mobile Safari/601.1"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_3_8; en-US) AppleWebKit/601.36 (KHTML, like Gecko) Chrome/48.0.2334.225 Safari/533"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.2;; en-US) Gecko/20100101 Firefox/48.2"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 7_6_9; en-US) AppleWebKit/537.28 (KHTML, like Gecko) Chrome/50.0.1506.381 Safari/537"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3; en-US) AppleWebKit/600.29 (KHTML, like Gecko) Chrome/55.0.3354.283 Safari/536"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.4;) Gecko/20130401 Firefox/49.2"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.4; WOW64) AppleWebKit/601.24 (KHTML, like Gecko) Chrome/49.0.2797.249 Safari/600.9 Edge/12.78781"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_1; like Mac OS X) AppleWebKit/536.48 (KHTML, like Gecko) Chrome/47.0.1794.366 Mobile Safari/600.9"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 10.1; Win64; x64; en-US) Gecko/20100101 Firefox/46.2"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_5_6) Gecko/20100101 Firefox/70.6"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 6.0.1; Nexus 6 Build/MDB08L) AppleWebKit/602.29 (KHTML, like Gecko) Chrome/53.0.3371.181 Mobile Safari/537.1"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_6_6; like Mac OS X) AppleWebKit/536.35 (KHTML, like Gecko) Chrome/54.0.2925.204 Mobile Safari/534.5"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.1; x64; en-US) AppleWebKit/533.43 (KHTML, like Gecko) Chrome/51.0.1012.314 Safari/601.1 Edge/16.56117"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_4; like Mac OS X) AppleWebKit/533.15 (KHTML, like Gecko) Chrome/51.0.2073.159 Mobile Safari/603.1"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 10.5; x64) Gecko/20100101 Firefox/74.0"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; Android 5.0; SAMSUNG SM-G920M Build/KTU84F) AppleWebKit/536.50 (KHTML, like Gecko) Chrome/50.0.3012.180 Mobile Safari/534.6"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (iPod; CPU iPod OS 11_1_1; like Mac OS X) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/51.0.3441.256 Mobile Safari/600.9"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows; U; Windows NT 6.2; x64 Trident/5.0)"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 10.2; x64) AppleWebKit/602.49 (KHTML, like Gecko) Chrome/47.0.3643.257 Safari/537.4 Edge/12.85433"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.5; WOW64; en-US) Gecko/20100101 Firefox/65.2"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.2; WOW64) AppleWebKit/603.45 (KHTML, like Gecko) Chrome/50.0.1764.163 Safari/600.1 Edge/12.53642"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; Android 7.1; LG-H920 Build/NRD90M) AppleWebKit/600.1 (KHTML, like Gecko) Chrome/47.0.2345.228 Mobile Safari/537.9"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_7_3; like Mac OS X) AppleWebKit/536.4 (KHTML, like Gecko) Chrome/48.0.2679.156 Mobile Safari/600.4"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 6.2; Win64; x64) Gecko/20100101 Firefox/65.4"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_0_3; en-US) Gecko/20100101 Firefox/57.3"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux x86_64; en-US) AppleWebKit/600.11 (KHTML, like Gecko) Chrome/49.0.2957.130 Safari/603"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (Android; Android 5.1.1; Nexus 9 Build/LRX22C) AppleWebKit/537.18 (KHTML, like Gecko) Chrome/53.0.2012.122 Mobile Safari/603.4"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 7_8_3; en-US) Gecko/20100101 Firefox/66.8"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux x86_64; en-US) Gecko/20100101 Firefox/69.7"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1;; en-US Trident/5.0)"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Android; Android 6.0.1; HTC One_M9 Build/MRA58K) AppleWebKit/602.49 (KHTML, like Gecko) Chrome/55.0.1303.169 Mobile Safari/533.5"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_4) AppleWebKit/535.13 (KHTML, like Gecko) Chrome/49.0.3228.294 Safari/533"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux x86_64; en-US) AppleWebKit/536.28 (KHTML, like Gecko) Chrome/48.0.1902.150 Safari/536"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; Android 5.1; Nexus 6 Build/LRX22C) AppleWebKit/601.29 (KHTML, like Gecko) Chrome/54.0.3611.348 Mobile Safari/534.9"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.2;; en-US) AppleWebKit/533.48 (KHTML, like Gecko) Chrome/55.0.3176.322 Safari/601"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 5.0.2; SM-G400 Build/LRX22C) AppleWebKit/601.48 (KHTML, like Gecko) Chrome/54.0.1952.143 Mobile Safari/603.6"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 10.2; WOW64; en-US) AppleWebKit/600.38 (KHTML, like Gecko) Chrome/48.0.2352.148 Safari/533.8 Edge/8.28857"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (U; Linux x86_64) AppleWebKit/600.19 (KHTML, like Gecko) Chrome/51.0.3607.161 Safari/601"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_8_1; like Mac OS X) AppleWebKit/535.31 (KHTML, like Gecko) Chrome/52.0.1259.365 Mobile Safari/535.2"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_10_7) AppleWebKit/603.39 (KHTML, like Gecko) Chrome/47.0.1231.174 Safari/533"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_0_4) AppleWebKit/600.9 (KHTML, like Gecko) Chrome/48.0.3767.203 Safari/602"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Linux; Linux i640 ) Gecko/20100101 Firefox/74.7"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 6.3; x64; en-US) Gecko/20100101 Firefox/53.1"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 10.4; Win64; x64) AppleWebKit/602.8 (KHTML, like Gecko) Chrome/47.0.3687.242 Safari/536.4 Edge/17.54516"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_1_6; like Mac OS X) AppleWebKit/533.22 (KHTML, like Gecko) Chrome/54.0.3574.274 Mobile Safari/603.3"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.4;; en-US) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/50.0.2442.143 Safari/535.0 Edge/16.74162"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 6.0;) AppleWebKit/600.13 (KHTML, like Gecko) Chrome/53.0.3413.135 Safari/602"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 6.3;) Gecko/20100101 Firefox/58.7"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux x86_64) AppleWebKit/536.23 (KHTML, like Gecko) Chrome/48.0.3281.297 Safari/533"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows; Windows NT 6.0; Win64; x64; en-US Trident/5.0)"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_4_1; like Mac OS X) AppleWebKit/601.29 (KHTML, like Gecko) Chrome/52.0.1221.393 Mobile Safari/536.8"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 10.0; Win64; x64) AppleWebKit/535.36 (KHTML, like Gecko) Chrome/49.0.1077.242 Safari/602.8 Edge/14.88394"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 7_1_7; en-US) AppleWebKit/537.24 (KHTML, like Gecko) Chrome/49.0.2094.303 Safari/537"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows; U; Windows NT 6.3; WOW64; en-US Trident/5.0)"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.0; WOW64; en-US) AppleWebKit/600.47 (KHTML, like Gecko) Chrome/47.0.3082.144 Safari/534.4 Edge/10.28211"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux i572 x86_64) Gecko/20100101 Firefox/55.3"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 10.0; x64; en-US) Gecko/20100101 Firefox/51.9"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows; U; Windows NT 10.1; WOW64 Trident/5.0)"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_3_6; like Mac OS X) AppleWebKit/600.28 (KHTML, like Gecko) Chrome/52.0.2721.114 Mobile Safari/602.6"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows; Windows NT 6.2; Trident/5.0)"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.0; x64) AppleWebKit/603.46 (KHTML, like Gecko) Chrome/50.0.1853.154 Safari/602.7 Edge/15.84551"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; en-US Trident/6.0)"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux i671 x86_64; en-US) AppleWebKit/603.2 (KHTML, like Gecko) Chrome/54.0.1916.361 Safari/537"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; Android 5.1; Nexus 9 Build/LMY48B) AppleWebKit/536.45 (KHTML, like Gecko) Chrome/51.0.2368.151 Mobile Safari/603.8"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_7_8; like Mac OS X) AppleWebKit/603.35 (KHTML, like Gecko) Chrome/52.0.3040.390 Mobile Safari/600.4"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (U; Linux i573 ; en-US) Gecko/20100101 Firefox/55.8"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_8; like Mac OS X) AppleWebKit/603.10 (KHTML, like Gecko) Chrome/51.0.1044.282 Mobile Safari/535.6"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_8_4; like Mac OS X) AppleWebKit/601.28 (KHTML, like Gecko) Chrome/55.0.2508.198 Mobile Safari/533.1"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (U; Linux x86_64; en-US) AppleWebKit/601.37 (KHTML, like Gecko) Chrome/48.0.3200.319 Safari/533"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_11_1) Gecko/20100101 Firefox/65.9"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 6.1; x64; en-US) AppleWebKit/600.1 (KHTML, like Gecko) Chrome/48.0.2221.375 Safari/603"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 10.0; Win64; x64; en-US) AppleWebKit/533.49 (KHTML, like Gecko) Chrome/49.0.2126.315 Safari/602.5 Edge/11.21742"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_2_4; like Mac OS X) AppleWebKit/601.13 (KHTML, like Gecko) Chrome/55.0.2603.126 Mobile Safari/600.8"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 8_8_2; en-US) AppleWebKit/533.35 (KHTML, like Gecko) Chrome/54.0.3676.347 Safari/603"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 8_4_8; like Mac OS X) AppleWebKit/601.2 (KHTML, like Gecko) Chrome/49.0.3963.277 Mobile Safari/535.9"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_5_3; like Mac OS X) AppleWebKit/535.40 (KHTML, like Gecko) Chrome/51.0.2621.119 Mobile Safari/534.7"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Android; Android 5.0.1; SM-N915V Build/LRX22C) AppleWebKit/600.14 (KHTML, like Gecko) Chrome/55.0.3710.325 Mobile Safari/536.2"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (U; Linux x86_64) Gecko/20130401 Firefox/59.2"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_8_7; like Mac OS X) AppleWebKit/603.26 (KHTML, like Gecko) Chrome/52.0.3557.298 Mobile Safari/600.2"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Linux; Linux x86_64; en-US) AppleWebKit/534.33 (KHTML, like Gecko) Chrome/53.0.2333.264 Safari/537"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 6.0.1; SAMSUNG SM-G9350V Build/MMB29K) AppleWebKit/601.40 (KHTML, like Gecko) Chrome/53.0.2409.108 Mobile Safari/534.8"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux i682 x86_64) Gecko/20100101 Firefox/58.1"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 6.3; WOW64; en-US) AppleWebKit/600.35 (KHTML, like Gecko) Chrome/50.0.1136.177 Safari/537"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 9_7_4; en-US) Gecko/20100101 Firefox/56.2"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 8_2_0; en-US) AppleWebKit/602.18 (KHTML, like Gecko) Chrome/50.0.3732.108 Safari/535"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.0; Trident/6.0)"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_6_8; like Mac OS X) AppleWebKit/600.28 (KHTML, like Gecko) Chrome/47.0.1445.181 Mobile Safari/602.3"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_6_6; like Mac OS X) AppleWebKit/537.6 (KHTML, like Gecko) Chrome/55.0.3352.126 Mobile Safari/534.8"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M) AppleWebKit/602.25 (KHTML, like Gecko) Chrome/51.0.1181.350 Mobile Safari/533.1"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_8; like Mac OS X) AppleWebKit/603.20 (KHTML, like Gecko) Chrome/50.0.2906.400 Mobile Safari/533.2"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; x64; en-US Trident/5.0)"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 7_8_5) AppleWebKit/536.13 (KHTML, like Gecko) Chrome/48.0.2684.377 Safari/536"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 6.1; x64; en-US) AppleWebKit/600.18 (KHTML, like Gecko) Chrome/51.0.3321.132 Safari/536"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.0; WOW64) AppleWebKit/600.42 (KHTML, like Gecko) Chrome/47.0.1606.120 Safari/603.0 Edge/17.85553"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (U; Linux i555 x86_64; en-US) Gecko/20100101 Firefox/63.2"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 10.0; Windows; Windows NT 6.3; Win64; x64; en-US Trident/6.0)"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux x86_64) AppleWebKit/533.43 (KHTML, like Gecko) Chrome/52.0.1151.126 Safari/535"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.1; WOW64; en-US) AppleWebKit/603.14 (KHTML, like Gecko) Chrome/54.0.1803.323 Safari/601.8 Edge/18.51359"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Android; Android 6.0.1; HTC One_M9 dual sim Build/MRA58K) AppleWebKit/603.7 (KHTML, like Gecko) Chrome/47.0.3415.189 Mobile Safari/601.6"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 6.2; Win64; x64) AppleWebKit/601.15 (KHTML, like Gecko) Chrome/54.0.3725.366 Safari/533"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; Linux x86_64; en-US) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/51.0.3722.286 Safari/603"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0;) AppleWebKit/602.8 (KHTML, like Gecko) Chrome/52.0.2907.154 Safari/602.2 Edge/18.50570"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux x86_64; en-US) AppleWebKit/601.22 (KHTML, like Gecko) Chrome/52.0.1469.170 Safari/601"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (iPad; CPU iPad OS 11_4_2 like Mac OS X) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/52.0.2573.336 Mobile Safari/601.3"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.4; x64; en-US) AppleWebKit/534.40 (KHTML, like Gecko) Chrome/49.0.3027.129 Safari/601.1 Edge/13.19129"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_9; like Mac OS X) AppleWebKit/534.3 (KHTML, like Gecko) Chrome/47.0.2280.195 Mobile Safari/537.7"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1; like Mac OS X) AppleWebKit/601.48 (KHTML, like Gecko) Chrome/52.0.2008.361 Mobile Safari/603.2"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux x86_64; en-US) AppleWebKit/536.24 (KHTML, like Gecko) Chrome/55.0.3584.120 Safari/537"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (U; Linux x86_64; en-US) Gecko/20100101 Firefox/59.6"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows; Windows NT 6.2;; en-US Trident/5.0)"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 8_0_5; en-US) AppleWebKit/602.14 (KHTML, like Gecko) Chrome/54.0.3398.310 Safari/602"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Linux; Linux i665 x86_64; en-US) Gecko/20100101 Firefox/48.4"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (U; Linux i544 ) AppleWebKit/601.22 (KHTML, like Gecko) Chrome/55.0.2573.379 Safari/534"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; Linux x86_64; en-US) AppleWebKit/601.15 (KHTML, like Gecko) Chrome/48.0.1868.324 Safari/601"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 11.0; Windows; Windows NT 6.1; x64 Trident/7.0)"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 7_0_5) Gecko/20100101 Firefox/49.2"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 7.1; Xperia Build/NDE63X) AppleWebKit/536.47 (KHTML, like Gecko) Chrome/51.0.2700.101 Mobile Safari/603.8"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Android; Android 4.3.1; SAMSUNG SM-T265v Build/JLS36C) AppleWebKit/602.14 (KHTML, like Gecko) Chrome/52.0.2269.287 Mobile Safari/601.9"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_12_2) Gecko/20100101 Firefox/72.8"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux x86_64; en-US) Gecko/20130401 Firefox/67.9"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 8.0; Windows; Windows NT 6.0; x64 Trident/4.0)"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (U; Linux i561 x86_64; en-US) AppleWebKit/535.42 (KHTML, like Gecko) Chrome/53.0.1583.192 Safari/535"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 6.1; x64; en-US) AppleWebKit/601.40 (KHTML, like Gecko) Chrome/54.0.2531.308 Safari/536.1 Edge/12.71096"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; Linux i665 ; en-US) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/47.0.2613.202 Safari/534"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux x86_64; en-US) Gecko/20130401 Firefox/56.5"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux x86_64) AppleWebKit/602.44 (KHTML, like Gecko) Chrome/52.0.3100.147 Safari/533"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_9_5) AppleWebKit/533.7 (KHTML, like Gecko) Chrome/51.0.3941.112 Safari/533"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; Android 7.0; Nexus 8X Build/NME91E) AppleWebKit/602.36 (KHTML, like Gecko) Chrome/49.0.1681.205 Mobile Safari/602.9"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux i670 x86_64; en-US) Gecko/20130401 Firefox/55.7"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (Android; Android 5.0; SAMSUNG-SM-N910V Build/LRX22C) AppleWebKit/603.3 (KHTML, like Gecko) Chrome/53.0.3007.233 Mobile Safari/600.3"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 8.0; Windows; Windows NT 6.1; WOW64 Trident/4.0)"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (iPod; CPU iPod OS 11_1_3; like Mac OS X) AppleWebKit/533.39 (KHTML, like Gecko) Chrome/53.0.1415.386 Mobile Safari/533.7"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 6.3; WOW64) AppleWebKit/533.37 (KHTML, like Gecko) Chrome/54.0.1460.119 Safari/537"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux i555 x86_64) AppleWebKit/537.23 (KHTML, like Gecko) Chrome/47.0.3520.332 Safari/602"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Linux i564 x86_64) Gecko/20100101 Firefox/48.8"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.5;) AppleWebKit/534.5 (KHTML, like Gecko) Chrome/54.0.2858.141 Safari/600.5 Edge/9.77151"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 10.0; Windows; Windows NT 6.1; WOW64; en-US Trident/6.0)"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 11.0; Windows; Windows NT 10.1; Trident/7.0)"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_3_3; like Mac OS X) AppleWebKit/603.27 (KHTML, like Gecko) Chrome/52.0.1096.257 Mobile Safari/533.0"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows; U; Windows NT 6.2;; en-US Trident/5.0)"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (Linux; Android 7.0; Xperia Build/NDE63X) AppleWebKit/536.22 (KHTML, like Gecko) Chrome/53.0.3591.167 Mobile Safari/535.6"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 8.0; Windows; U; Windows NT 6.1;; en-US Trident/4.0)"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; Android 7.0; Pixel XL Build/NME91E) AppleWebKit/536.4 (KHTML, like Gecko) Chrome/52.0.1642.268 Mobile Safari/533.3"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 5.1; SAMSUNG SM-G925L Build/LMY47X) AppleWebKit/534.36 (KHTML, like Gecko) Chrome/50.0.3608.256 Mobile Safari/537.6"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux x86_64; en-US) AppleWebKit/602.9 (KHTML, like Gecko) Chrome/55.0.3222.320 Safari/602"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_6_7; like Mac OS X) AppleWebKit/602.49 (KHTML, like Gecko) Chrome/48.0.3857.260 Mobile Safari/601.6"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 10.4; x64 Trident/4.0)"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 6.2;; en-US Trident/4.0)"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux x86_64; en-US) AppleWebKit/601.21 (KHTML, like Gecko) Chrome/49.0.3686.225 Safari/603"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 10.3;; en-US) Gecko/20100101 Firefox/47.6"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_0; like Mac OS X) AppleWebKit/603.45 (KHTML, like Gecko) Chrome/53.0.3795.239 Mobile Safari/600.8"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 10.3; x64) AppleWebKit/602.46 (KHTML, like Gecko) Chrome/54.0.1495.354 Safari/537.1 Edge/10.52974"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_11_7) Gecko/20130401 Firefox/58.9"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_6) AppleWebKit/602.20 (KHTML, like Gecko) Chrome/53.0.3240.232 Safari/600"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (U; Linux i570 ; en-US) AppleWebKit/536.43 (KHTML, like Gecko) Chrome/52.0.3847.319 Safari/535"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 4.4.4; SM-J200G Build/KTU84P) AppleWebKit/536.29 (KHTML, like Gecko) Chrome/50.0.3515.316 Mobile Safari/534.6"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_5_4; like Mac OS X) AppleWebKit/601.25 (KHTML, like Gecko) Chrome/52.0.1981.358 Mobile Safari/534.9"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.2; x64) AppleWebKit/602.42 (KHTML, like Gecko) Chrome/49.0.3395.155 Safari/533.7 Edge/13.78173"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 7.0; Windows NT 6.3; Win64; x64; en-US Trident/4.0)"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux i556 x86_64; en-US) Gecko/20130401 Firefox/67.6"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux i551 x86_64; en-US) AppleWebKit/602.3 (KHTML, like Gecko) Chrome/48.0.1151.215 Safari/603"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (iPad; CPU iPad OS 11_6_0 like Mac OS X) AppleWebKit/601.37 (KHTML, like Gecko) Chrome/48.0.2756.338 Mobile Safari/603.9"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (U; Linux x86_64) Gecko/20100101 Firefox/71.7"
    },
    {
        device: "edge",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 10.5; WOW64) AppleWebKit/602.20 (KHTML, like Gecko) Chrome/49.0.1818.344 Safari/534.3 Edge/12.45018"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 8_6_2; like Mac OS X) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/48.0.1069.226 Mobile Safari/600.0"
    },
    {
        device: "windows",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 10.0; Windows; U; Windows NT 10.5; Win64; x64; en-US Trident/6.0)"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_1; en-US) Gecko/20100101 Firefox/74.5"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_6_0; like Mac OS X) AppleWebKit/537.19 (KHTML, like Gecko) Chrome/53.0.2180.304 Mobile Safari/533.8"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 6 Build/MMB29K) AppleWebKit/600.33 (KHTML, like Gecko) Chrome/54.0.3118.178 Mobile Safari/534.1"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows; U; Windows NT 6.3; Win64; x64; en-US Trident/5.0)"
    },
    {
        device: "chrome",
        "User-Agent": "Mozilla/5.0 (Windows; Windows NT 6.3; x64; en-US) AppleWebKit/603.40 (KHTML, like Gecko) Chrome/53.0.3192.249 Safari/537"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 10.0; Windows; U; Windows NT 6.2; WOW64 Trident/6.0)"
    },
    {
        device: "firefox",
        "User-Agent": "Mozilla/5.0 (Linux x86_64; en-US) Gecko/20130401 Firefox/69.7"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux; U; Linux i566 x86_64; en-US) AppleWebKit/533.44 (KHTML, like Gecko) Chrome/55.0.3604.245 Safari/600"
    },
    {
        device: "linux",
        "User-Agent": "Mozilla/5.0 (Linux i545 x86_64; en-US) Gecko/20100101 Firefox/57.8"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_4_1) AppleWebKit/602.9 (KHTML, like Gecko) Chrome/51.0.2392.292 Safari/601"
    },
    {
        device: "mac",
        "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_1_5; en-US) AppleWebKit/537.42 (KHTML, like Gecko) Chrome/47.0.3160.358 Safari/602"
    },
    {
        device: "android",
        "User-Agent": "Mozilla/5.0 (Android; Android 5.1; SM-G920H Build/LRX22G) AppleWebKit/533.38 (KHTML, like Gecko) Chrome/49.0.2849.335 Mobile Safari/537.0"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_6_4; like Mac OS X) AppleWebKit/602.36 (KHTML, like Gecko) Chrome/49.0.2278.307 Mobile Safari/603.9"
    },
    {
        device: "iphone",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 8_8_4; like Mac OS X) AppleWebKit/534.29 (KHTML, like Gecko) Chrome/49.0.2793.386 Mobile Safari/535.9"
    },
    {
        device: "explorer",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 7.0; Windows; Windows NT 6.0; WOW64; en-US Trident/4.0)"
    },
    {
        device: "mobile",
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 5.0.2; SAMSUNG SM-G460 Build/LRX22G) AppleWebKit/600.37 (KHTML, like Gecko) Chrome/50.0.3826.386 Mobile Safari/536.9"
    }
];
const languages = [
    'en',
    'en;q=0.9',
    'en;q=0.9,es;q=0.8',
    'en;q=0.9,es;q=0.8,fr;q=0.7',
    'en;q=0.9,es;q=0.8,fr;q=0.7,de;q=0.6',
    'en;q=0.9,es;q=0.8,fr;q=0.7,de;q=0.6,it;q=0.5',
    'fr',
    'fr;q=0.9',
    'fr;q=0.9,en;q=0.8',
    'fr;q=0.9,en;q=0.8,es;q=0.7',
    'fr;q=0.9,en;q=0.8,es;q=0.7,de;q=0.6',
    'fr;q=0.9,en;q=0.8,es;q=0.7,de;q=0.6,it;q=0.5',
    'es',
    'es;q=0.9',
    'es;q=0.9,en;q=0.8',
    'es;q=0.9,en;q=0.8,fr;q=0.7',
    'es;q=0.9,en;q=0.8,fr;q=0.7,de;q=0.6',
    'es;q=0.9,en;q=0.8,fr;q=0.7,de;q=0.6,it;q=0.5',
    'de',
    'de;q=0.9',
    'de;q=0.9,en;q=0.8',
    'de;q=0.9,en;q=0.8,fr;q=0.7',
    'de;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'de;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,it;q=0.5',
    'it',
    'it;q=0.9',
    'it;q=0.9,en;q=0.8',
    'it;q=0.9,en;q=0.8,fr;q=0.7',
    'it;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'it;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'ja',
    'ja;q=0.9',
    'ja;q=0.9,en;q=0.8',
    'ja;q=0.9,en;q=0.8,fr;q=0.7',
    'ja;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'ja;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'ko',
    'ko;q=0.9',
    'ko;q=0.9,en;q=0.8',
    'ko;q=0.9,en;q=0.8,fr;q=0.7',
    'ko;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'ko;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'zh',
    'zh;q=0.9',
    'zh;q=0.9,en;q=0.8',
    'zh;q=0.9,en;q=0.8,fr;q=0.7',
    'zh;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'zh;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'ru',
    'ru;q=0.9',
    'ru;q=0.9,en;q=0.8',
    'ru;q=0.9,en;q=0.8,fr;q=0.7',
    'ru;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'ru;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'pt',
    'pt;q=0.9',
    'pt;q=0.9,en;q=0.8',
    'pt;q=0.9,en;q=0.8,fr;q=0.7',
    'pt;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'pt;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'nl',
    'nl;q=0.9',
    'nl;q=0.9,en;q=0.8',
    'nl;q=0.9,en;q=0.8,fr;q=0.7',
    'nl;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'nl;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'sv',
    'sv;q=0.9',
    'sv;q=0.9,en;q=0.8',
    'sv;q=0.9,en;q=0.8,fr;q=0.7',
    'sv;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'sv;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'fi',
    'fi;q=0.9',
    'fi;q=0.9,en;q=0.8',
    'fi;q=0.9,en;q=0.8,fr;q=0.7',
    'fi;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'fi;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'da',
    'da;q=0.9',
    'da;q=0.9,en;q=0.8',
    'da;q=0.9,en;q=0.8,fr;q=0.7',
    'da;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'da;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'no',
    'no;q=0.9',
    'no;q=0.9,en;q=0.8',
    'no;q=0.9,en;q=0.8,fr;q=0.7',
    'no;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'no;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'hu',
    'hu;q=0.9',
    'hu;q=0.9,en;q=0.8',
    'hu;q=0.9,en;q=0.8,fr;q=0.7',
    'hu;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'hu;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'cs',
    'cs;q=0.9',
    'cs;q=0.9,en;q=0.8',
    'cs;q=0.9,en;q=0.8,fr;q=0.7',
    'cs;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'cs;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'pl',
    'pl;q=0.9',
    'pl;q=0.9,en;q=0.8',
    'pl;q=0.9,en;q=0.8,fr;q=0.7',
    'pl;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'pl;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'ro',
    'ro;q=0.9',
    'ro;q=0.9,en;q=0.8',
    'ro;q=0.9,en;q=0.8,fr;q=0.7',
    'ro;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'ro;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'sk',
    'sk;q=0.9',
    'sk;q=0.9,en;q=0.8',
    'sk;q=0.9,en;q=0.8,fr;q=0.7',
    'sk;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'sk;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'tr',
    'tr;q=0.9',
    'tr;q=0.9,en;q=0.8',
    'tr;q=0.9,en;q=0.8,fr;q=0.7',
    'tr;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'tr;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'bg',
    'bg;q=0.9',
    'bg;q=0.9,en;q=0.8',
    'bg;q=0.9,en;q=0.8,fr;q=0.7',
    'bg;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'bg;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'ar',
    'ar;q=0.9',
    'ar;q=0.9,en;q=0.8',
    'ar;q=0.9,en;q=0.8,fr;q=0.7',
    'ar;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'ar;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'he',
    'he;q=0.9',
    'he;q=0.9,en;q=0.8',
    'he;q=0.9,en;q=0.8,fr;q=0.7',
    'he;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'he;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'hi',
    'hi;q=0.9',
    'hi;q=0.9,en;q=0.8',
    'hi;q=0.9,en;q=0.8,fr;q=0.7',
    'hi;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'hi;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'th',
    'th;q=0.9',
    'th;q=0.9,en;q=0.8',
    'th;q=0.9,en;q=0.8,fr;q=0.7',
    'th;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'th;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'vi',
    'vi;q=0.9',
    'vi;q=0.9,en;q=0.8',
    'vi;q=0.9,en;q=0.8,fr;q=0.7',
    'vi;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'vi;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'id',
    'id;q=0.9',
    'id;q=0.9,en;q=0.8',
    'id;q=0.9,en;q=0.8,fr;q=0.7',
    'id;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'id;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'ms',
    'ms;q=0.9',
    'ms;q=0.9,en;q=0.8',
    'ms;q=0.9,en;q=0.8,fr;q=0.7',
    'ms;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'ms;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'tl',
    'tl;q=0.9',
    'tl;q=0.9,en;q=0.8',
    'tl;q=0.9,en;q=0.8,fr;q=0.7',
    'tl;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'tl;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'fil',
    'fil;q=0.9',
    'fil;q=0.9,en;q=0.8',
    'fil;q=0.9,en;q=0.8,fr;q=0.7',
    'fil;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'fil;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'af',
    'af;q=0.9',
    'af;q=0.9,en;q=0.8',
    'af;q=0.9,en;q=0.8,fr;q=0.7',
    'af;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'af;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'sq',
    'sq;q=0.9',
    'sq;q=0.9,en;q=0.8',
    'sq;q=0.9,en;q=0.8,fr;q=0.7',
    'sq;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'sq;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'am',
    'am;q=0.9',
    'am;q=0.9,en;q=0.8',
    'am;q=0.9,en;q=0.8,fr;q=0.7',
    'am;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'am;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'sw',
    'sw;q=0.9',
    'sw;q=0.9,en;q=0.8',
    'sw;q=0.9,en;q=0.8,fr;q=0.7',
    'sw;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'sw;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'so',
    'so;q=0.9',
    'so;q=0.9,en;q=0.8',
    'so;q=0.9,en;q=0.8,fr;q=0.7',
    'so;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'so;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'lo',
    'lo;q=0.9',
    'lo;q=0.9,en;q=0.8',
    'lo;q=0.9,en;q=0.8,fr;q=0.7',
    'lo;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'lo;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'mn',
    'mn;q=0.9',
    'mn;q=0.9,en;q=0.8',
    'mn;q=0.9,en;q=0.8,fr;q=0.7',
    'mn;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'mn;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'ne',
    'ne;q=0.9',
    'ne;q=0.9,en;q=0.8',
    'ne;q=0.9,en;q=0.8,fr;q=0.7',
    'ne;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'ne;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5',
    'pa',
    'pa;q=0.9',
    'pa;q=0.9,en;q=0.8',
    'pa;q=0.9,en;q=0.8,fr;q=0.7',
    'pa;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6',
    'pa;q=0.9,en;q=0.8,fr;q=0.7,es;q=0.6,de;q=0.5'
];
const generateUserAgent = () => {
    const desktopOSList = ["Windows", "Macintosh", "Linux"];
    let platform = "";
    const randomHeader = agents[Math.floor(Math.random() * agents.length)];
    var versionMatch = randomHeader['User-Agent'].match(/Chrome\/(\d+)\./);
    let isDesktop = false;
    for (let i = 0; i < desktopOSList.length; i++) {
        if (randomHeader['User-Agent'].indexOf(desktopOSList[i]) !== -1 && randomHeader['User-Agent'].indexOf("Android") === -1) {
            // console.log(`${randomHeader['User-Agent']} contains ${desktopOSList[i]}`);
            platform = desktopOSList[i];
            isDesktop = true;
        }
    }
    if (isDesktop) {
        if (versionMatch && versionMatch[1]) {
            if (Math.floor(Math.random() * 2) == 0) {
                // randomHeader['Sec-Ch-Ua'] = "\"Google Chrome\";v=\"" + versionMatch[1] + "\", \"Chromium\";v=\"" + versionMatch[1] + "\"";
            }
            else {
                const notABrand = Math.floor(Math.random() * 20);
                // randomHeader['Sec-Ch-Ua'] = "\"Google Chrome\";v=\"" + versionMatch[1] + "\", \"Not:A-Brand\";v=\"" + notABrand + "\", \"Chromium\";v=\"" + versionMatch[1] + "\"";
            }
        }
        if (randomHeader.device !== "mac") {
            // randomHeader['Sec-Ch-Ua-Mobile'] = "?0";
            // randomHeader['Sec-Ch-Ua-Platform'] = "\"" + platform + "\"";
        }
    }
    else {
        if (randomHeader.device !== "iphone" && randomHeader.device !== "mobile") {
            // randomHeader && randomHeader.device ? randomHeader['Sec-Ch-Ua-Platform'] = "\"" + randomHeader.device.charAt(0).toUpperCase() + randomHeader.device.slice(1) + "\"" : null;
            // randomHeader['Sec-Ch-Ua-Mobile'] = "?1";
        }
    }
    delete randomHeader.device;
    return randomHeader;
};
module.exports = {
    generateUserAgent
};
