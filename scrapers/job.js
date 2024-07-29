const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');
const JobListing = require('../models/JobListing.model');

const data = [
    {
        title: 'Junior Software Engineer',
        company: 'Algolia',
        location: 'Paris, Île-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/junior-software-engineer-at-algolia-3984452579?position=1&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=PyCidKWtMue8Sbc6x%2BKsjw%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'https://media.licdn.com/dms/image/D4E0BAQFgLCZL0MUkyQ/company-logo_100_100/0/1720449907188/algolia_logo?e=2147483647&v=beta&t=8WgmYhsWd7kGHvML3-is-sPOIBCiaVQ-2n-CtMgPBUA'
    },
    {
        title: 'Senior Solutions Engineer - Crypto',
        company: 'Career Renew',
        location: 'France',
        datePosted: '2024-07-28',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-solutions-engineer-crypto-at-career-renew-3986335414?position=2&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=nQWYsKMaUBnWkt5e3WXGFQ%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'https://media.licdn.com/dms/image/C4D0BAQETNBRRR6i4NQ/company-logo_100_100/0/1658956948124/career_renew_logo?e=2147483647&v=beta&t=mULjKVOdeBhD9bfaPiumdi0AATQuBQYD3q81z_BM8O8'
    },
    {
        title: 'Python Developer',
        company: '5V Tech | Certified B Corp™',
        location: 'Paris, Île-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/python-developer-at-5v-tech-certified-b-corp%E2%84%A2-3984452057?position=3&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=k9S6dQl3LhR8QP7r70kC9Q%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'https://media.licdn.com/dms/image/D4E0BAQEICWDIhM_vFQ/company-logo_100_100/0/1688391519080/5v_tech_logo?e=2147483647&v=beta&t=W-bp644-qQn23kY3Izd0jXNi6NdeMacE3Xz-QFIrj0g'
    },
    {
        title: 'Cryptography Engineer',
        company: 'remoti',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/cryptography-engineer-at-remoti-3987105649?position=4&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=LrLL3wfiiLYbBZa0v%2BV3vg%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer - Backend (E5)',
        company: 'Fountain',
        location: 'Lacaussade, Nouvelle-Aquitaine, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-backend-e5-at-fountain-3987106641?position=5&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=IuL%2FJVsZ4WRjB8BPRjTzNg%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Research Engineer, Applied AI',
        company: 'kapa.ai',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/research-engineer-applied-ai-at-kapa-ai-3987200497?position=6&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=Jyscrk%2B4Moz9uOQj1cEcuA%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer, Scale',
        company: 'Algolia',
        location: 'Paris, Île-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-scale-at-algolia-3984456018?position=7&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=7JNj3Afz7C0QfrMNxSmN6w%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'AI Founder - Senior Full Stack Developer',
        company: 'CogniFab',
        location: 'Paris, Île-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/ai-founder-senior-full-stack-developer-at-cognifab-3986930177?position=8&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=q65lJUtmYVoZD4ocMN8KKA%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: '🔥Urgent Full-stack Contract Role | NextJS/Typescript/Node/React | Incredible Greenfield opportunity, SaaS | 400-500 euros per day | France, Fully remote🔥',
        company: 'Owen Thomas',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/%F0%9F%94%A5urgent-full-stack-contract-role-nextjs-typescript-node-react-incredible-greenfield-opportunity-saas-400-500-euros-per-day-france-fully-remote%F0%9F%94%A5-at-owen-thomas-3986925936?position=9&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=JgEGsD4dFabRQFg7ctNnlw%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Machine Learning Engineer',
        company: 'Mirakl',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/machine-learning-engineer-at-mirakl-3984472711?position=10&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=qTY3%2BEwjCTNgTHiJs0U1Lw%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer (Python/Linux/Packaging)',
        company: 'Canonical',
        location: 'Paris, Île-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-python-linux-packaging-at-canonical-3986935194?position=11&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=%2Bvy%2FlXPN4G76tSTl0TFdvA%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer (Python/Linux/Packaging)',
        company: 'Canonical',
        location: 'Grenoble, Auvergne-Rhône-Alpes, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-python-linux-packaging-at-canonical-3986937145?position=12&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=RcNsA2AXYcOB8HxEXkPNIw%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer (Python/Linux/Packaging)',
        company: 'Canonical',
        location: 'Strasbourg, Grand Est, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-python-linux-packaging-at-canonical-3986936174?position=13&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=TtZLB41RMc8LReeX%2B9ot6g%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer (Python/Linux/Packaging)',
        company: 'Canonical',
        location: 'Lyon, Auvergne-Rhône-Alpes, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-python-linux-packaging-at-canonical-3986936177?position=14&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=xS4W1qTpAwYzsyJwHkxyiQ%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Développeur·se Fullstack expérimenté·e programmation fonctionnelle',
        company: 'AUTOGRIFF',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/d%C3%A9veloppeur%C2%B7se-fullstack-exp%C3%A9riment%C3%A9%C2%B7e-programmation-fonctionnelle-at-autogriff-3553151644?position=15&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=CmVf3XRWArDta5uaOMhkCA%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer (Python/Linux/Packaging)',
        company: 'Canonical',
        location: "Marseille, Provence-Alpes-Côte d'Azur, France",
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-python-linux-packaging-at-canonical-3986936172?position=16&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=8fBXalnDoafsTxb7rGESNQ%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer (Python/Linux/Packaging)',
        company: 'Canonical',
        location: "Nice, Provence-Alpes-Côte d'Azur, France",
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-python-linux-packaging-at-canonical-3986931751?position=17&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=FMbejahjwBvbfo8C5hQ3RA%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer (Python/Linux/Packaging)',
        company: 'Canonical',
        location: 'Toulouse, Occitanie, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-python-linux-packaging-at-canonical-3986932560?position=18&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=EohEnVbiPkm6UgxMxjQRSA%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer (Python/Linux/Packaging)',
        company: 'Canonical',
        location: 'Bordeaux, Nouvelle-Aquitaine, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-python-linux-packaging-at-canonical-3986933434?position=19&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=K5kMhVmnnwCDErVWOYkSog%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer (Python/Linux/Packaging)',
        company: 'Canonical',
        location: 'Metz, Grand Est, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-python-linux-packaging-at-canonical-3986935202?position=20&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=peL131ZRgaUUW%2BdmFqNLWQ%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer (Python/Linux/Packaging)',
        company: 'Canonical',
        location: 'Rennes, Brittany, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-python-linux-packaging-at-canonical-3986938133?position=21&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=cv4%2F7jYRlUi3fc%2FmRZVzKA%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer (Python/Linux/Packaging)',
        company: 'Canonical',
        location: 'Nantes, Pays de la Loire, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-python-linux-packaging-at-canonical-3986934368?position=22&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=%2BopYZAm6IU6tQQKOkyhhhg%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'SecOps Engineer - Crypto',
        company: 'Career Renew',
        location: 'France',
        datePosted: '2024-07-28',
        jobURL: 'https://fr.linkedin.com/jobs/view/secops-engineer-crypto-at-career-renew-3986324388?position=23&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=Cy7mxMyHxctxErTK%2FZ7dVA%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer (Python/Linux/Packaging)',
        company: 'Canonical',
        location: 'Lille, Hauts-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-python-linux-packaging-at-canonical-3986932558?position=24&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=H4Ly0RxQq6sfXlWW5uwZug%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Senior Python Developer',
        company: 'Match Point',
        location: 'Paris, Île-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-python-developer-at-match-point-3987008970?position=25&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=o9U03WihusCBXPITQ%2F%2BppQ%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Lead Software Engineer AI / Gen AI',
        company: 'Syensqo',
        location: 'Aubervilliers, Île-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/lead-software-engineer-ai-gen-ai-at-syensqo-3986996623?position=26&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=9veSfPi9fQQxJkKnzhmOUw%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Lead Software Engineer AI / Gen AI',
        company: 'Syensqo',
        location: 'Lyon, Auvergne-Rhône-Alpes, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/lead-software-engineer-ai-gen-ai-at-syensqo-3986996621?position=27&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=uPopp3qRWaAVVZmJf0%2FTLQ%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Senior Solutions Engineer (Europe-based, remote role)',
        company: 'AuthZed',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-solutions-engineer-europe-based-remote-role-at-authzed-3987200489?position=28&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=aQzqwfdZugNVwbci12QBkQ%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Solution Engineer, South EMEA',
        company: 'DoiT International',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/solution-engineer-south-emea-at-doit-international-3987096224?position=29&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=A7NIhXLqv6gZ0FqPSeFOmQ%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Senior Java Back-end Developer (full remote)',
        company: 'AODocs',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-java-back-end-developer-full-remote-at-aodocs-3986956837?position=30&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=HhH5wKru43VNd5OZDH%2Fbvg%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Data Scientist',
        company: 'Mirakl',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/data-scientist-at-mirakl-3984473727?position=31&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=ArP7QsrVSGBbKldXzfvpvg%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Développeur/euse JAVA - CMS',
        company: 'Groupe Asten',
        location: 'Quimper, Brittany, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/d%C3%A9veloppeur-euse-java-cms-at-groupe-asten-3986507227?position=32&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=wsyaoLk%2Fc8jWJxqiDi4xJw%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Senior / Staff Backend Software Engineer - remote friendly',
        company: 'Qonto',
        location: 'Paris, Île-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-staff-backend-software-engineer-remote-friendly-at-qonto-3986974857?position=33&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=roG20Er8qndP7IFqAeyP1w%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Software Engineer Java',
        company: 'Mirakl',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/software-engineer-java-at-mirakl-3984472709?position=34&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=HYFXcOUgpvL2IbIGPu2VTA%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Senior Staff Engineer -FICO',
        company: 'Nagarro',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-staff-engineer-fico-at-nagarro-3966852922?position=35&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=R6XsxLN6vCEF1usrb%2BpYpQ%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Distributed Systems Applied Researcher',
        company: 'Institute of Free Technology',
        location: 'Paris, Île-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/distributed-systems-applied-researcher-at-institute-of-free-technology-3948994314?position=36&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=kNNlOyn2yOyai2VCoHJzkg%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Data engineer cloud confirmé H/F',
        company: 'DPD France',
        location: 'Greater Grenoble Metropolitan Area',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/data-engineer-cloud-confirm%C3%A9-h-f-at-dpd-france-3987038387?position=37&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=etqLrDnvpLr5i%2BoBGTDFkQ%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Senior Software engineer - Banking / Ledger',
        company: 'Flowie',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-software-engineer-banking-ledger-at-flowie-3986357264?position=38&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=XnAiRi5ax7g%2B9uWQb3Ilag%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Senior Software Engineer - Search Infrastructure',
        company: 'Algolia',
        location: 'Paris, Île-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-software-engineer-search-infrastructure-at-algolia-3984454482?position=39&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=tSB28MTEVoRfNogyUehWkw%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Ingénieur Architecte Logiciel Temps Réel H/F',
        company: 'Assystem',
        location: "Saint-Paul-lez-Durance, Provence-Alpes-Côte d'Azur, France",
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/ing%C3%A9nieur-architecte-logiciel-temps-r%C3%A9el-h-f-at-assystem-3984452678?position=40&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=1x1OLcnOCHjVexWnroHrlw%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Developer Craft Senior Java Et - Ou Angular H/F',
        company: 'Simplifia',
        location: 'Lyon, Auvergne-Rhône-Alpes, France',
        datePosted: '2024-07-28',
        jobURL: 'https://fr.linkedin.com/jobs/view/developer-craft-senior-java-et-ou-angular-h-f-at-simplifia-3986309869?position=41&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=LxCLPHLHKkwgTe0Bnpluww%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Senior Data Engineer',
        company: 'Pleo',
        location: 'Paris, Île-de-France, France',
        datePosted: '2024-07-28',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-data-engineer-at-pleo-3986317882?position=42&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=bw04%2FSCpVxYpIJ1jH3Lx7w%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Senior Backend Software Engineer, Dashboard Platform',
        company: 'Algolia',
        location: 'Paris, Île-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-backend-software-engineer-dashboard-platform-at-algolia-3984451578?position=43&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=XK8TGoqG%2Bepqo8TeCLC%2FKA%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Développeur PHP/Symfony (H/F)',
        company: 'SensioLabs',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/d%C3%A9veloppeur-php-symfony-h-f-at-sensiolabs-3987012265?position=44&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=O%2FMJeXn9bf6S4i2Ck2RPkQ%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Business Développeur',
        company: 'Groupe VOG',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/business-d%C3%A9veloppeur-at-groupe-vog-3986931076?position=45&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=%2BwWQeWSWNzSq2xvr6XGkxA%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Partner Solutions Engineer',
        company: 'Cloudera',
        location: 'Lacaussade, Nouvelle-Aquitaine, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/partner-solutions-engineer-at-cloudera-3971737187?position=46&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=TvgabuVncgE4GOdA5PZAXw%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Data Infrastructure Engineer (Full Remote Policy)',
        company: 'Brevo',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/data-infrastructure-engineer-full-remote-policy-at-brevo-3969046167?position=47&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=rOoACSRjMkO831Xqp6%2FQMA%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Senior Data Engineer',
        company: 'Algolia',
        location: 'Paris, Île-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-data-engineer-at-algolia-3984449957?position=48&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=4JRXIFFbJpvYNsigA7Ix6g%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: '(Senior) Data Engineer',
        company: 'Mirakl',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-data-engineer-at-mirakl-3984478137?position=49&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=PQIXl5U5%2Bu%2BnHfKygqLf5w%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Developer Fullstack Senior - Angular - Java H/F',
        company: 'Simplifia',
        location: 'Lyon, Auvergne-Rhône-Alpes, France',
        datePosted: '2024-07-28',
        jobURL: 'https://fr.linkedin.com/jobs/view/developer-fullstack-senior-angular-java-h-f-at-simplifia-3986310909?position=50&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=fHQRVQ9M9EjfVqSbN%2BDFMw%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Lead Developer PHP / Symfony (H/F)',
        company: 'SensioLabs',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/lead-developer-php-symfony-h-f-at-sensiolabs-3987009315?position=51&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=qf%2BzvVvieG3MgI7Z1hZ8Cw%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Senior Frontend Developer - Angular (Full Remote from France)',
        company: 'AODocs',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-frontend-developer-angular-full-remote-from-france-at-aodocs-3986961261?position=52&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=%2FXGrltMYuU71EpjZFo5AxQ%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Senior Solutions Engineer - German Speaking',
        company: 'Algolia',
        location: 'Paris, Île-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-solutions-engineer-german-speaking-at-algolia-3984457029?position=53&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=ebBlErXhz2uLARIfJYfolg%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'SRE - Site Reliability Engineer',
        company: 'AODocs',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/sre-site-reliability-engineer-at-aodocs-3986950758?position=54&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=Po4n6FtFZ0Eu3zq221bt9g%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Senior Site Reliability Engineer, Fleet',
        company: 'Algolia',
        location: 'Paris, Île-de-France, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-site-reliability-engineer-fleet-at-algolia-3984457019?position=55&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=QXLYrQjTwoZ%2F7yLJDGwuqg%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Site Reliability Engineer (SRE) - Data',
        company: 'Mirakl',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/site-reliability-engineer-sre-data-at-mirakl-3984476278?position=56&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=hlEzTEP26eTj8WnD%2F%2BhUeA%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Site Reliability Engineer',
        company: 'Mirakl',
        location: 'France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/site-reliability-engineer-at-mirakl-3984473716?position=57&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=8iQgx%2FC7qKz43Zao5pEFnQ%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    },
    {
        title: 'Senior Kubernetes Operations Engineer',
        company: 'Lambda',
        location: 'Eu, Normandy, France',
        datePosted: '2024-07-29',
        jobURL: 'https://fr.linkedin.com/jobs/view/senior-kubernetes-operations-engineer-at-lambda-3984477444?position=58&pageNum=0&refId=UYauiORCTg2djq6BNZc5rg%3D%3D&trackingId=oEfcvYPsBlaWPjHl2%2FsGFg%3D%3D&trk=public_jobs_jserp-result_search-card',
        companyLogo: 'N/A'
    }
]

const delay = async (min = 3000, max = 4000, randomIncrease = 0) => {
    if (randomIncrease) {
        min += Math.random() * randomIncrease;
        max += Math.random() * randomIncrease;
    }
    const time = Math.random() * (max - min) + min;
    return new Promise(async (resolve) => setTimeout(resolve, time));
};

const initializeBrowserAndPage = async () => {

    try {
        puppeteer.use(stealthPlugin());
        const browser = await puppeteer.launch({
            headless: false, // Set to false to see the browser in action
            args: [
                `--no-sandbox`,
                `--disable-setuid-sandbox`,
                `--proxy-server=http://fr.proxymesh.com:31280`,
                `--auto-open-devtools-for-tabs`
            ],
            defaultViewport: {
                width: 430,
                height: 932,
                deviceScaleFactor: 1,
            }
        });

        const pages = await browser.pages();
        const page = pages[0];
        await page.setJavaScriptEnabled(true);
        await page.evaluateOnNewDocument(() => {
            delete navigator.__proto__.webdriver;
        });

        // If your proxy requires authentication, you can set it like this:
        // await page.authenticate({
        //     username: 'your-proxy-username', // Replace with your proxy username
        //     password: 'your-proxy-password', // Replace with your proxy password
        // });

        return { page, browser };
    } catch (error) {
        throw new Error('Error Initializing Browser And Page:', error);
    }
}

const goToURL = async (page) => {
    try {
        await page.goto('https://www.linkedin.com/jobs/search', {
            waitUntil: 'networkidle2', // Wait until the network is idle
        });
        await delay();
        const currentURL = await page.url();
        if (!currentURL.includes('jobs/search')) {
            await delay();
            await page.goto('https://www.linkedin.com/jobs/search', {
                waitUntil: 'networkidle2', // Wait until the network is idle
            });
        }
    }
    catch (error) {
        throw new Error('Error Navigating To URL:', error);
    }
}

const acceptCookies = async (page) => {
    console.log('Accept Cookies');

    await delay();
    if (await !page.$('button.artdeco-global-alert-action')) {
        console.log('No Cookie Button Found');
        return;
    }
    console.log('Accept Cookies');
    await page.locator('button.artdeco-global-alert-action').click();

}

const insertJob = async (page, jobDescription) => {
    try {
        console.log('Set Job');
        await delay(4000, 5000);
        if (await !page.$('button[data-tracking-control-name="public_jobs_search-switcher-opener')) {
            throw new Error('No Job Button Found');
        }
        await page.locator('button[data-tracking-control-name="public_jobs_search-switcher-opener"]').click();
        await delay();
        for (const char of jobDescription) {
            await page.type('input[aria-controls="job-search-bar-keywords-typeahead-list"]', char); // No delay here, we handle it ourselves
            await delay(200, 500, 500); // Variable delay between characters
        }
        await delay();
        await page.keyboard.press('Enter');
    } catch (error) {
        throw new Error('Error Inserting Job:', error);
    }
}

const insertCountry = async (page, country) => {
    try {
        console.log('Set Country');
        await delay(4000, 5000);
        if (await !page.$('button[data-tracking-control-name="public_jobs_search-switcher-opener"]')) {
            throw new Error('No Country Button Found');
        }
        await page.locator('button[data-tracking-control-name="public_jobs_search-switcher-opener"]').click();

        await delay();
        await page.locator('input[aria-controls="job-search-bar-location-typeahead-list"]').click();

        await delay();

        for (let i = 0; i < 18; i++) {
            await page.keyboard.down('Backspace');
            await delay(200, 500);
        }

        for (const char of country) {
            await page.type('input[aria-controls="job-search-bar-location-typeahead-list"]', char);
            await delay(200, 500, 500);
        }
        await delay();
        await page.keyboard.press('Enter');
    } catch (error) {
        throw new Error('Error Inserting Country:', error);
    }


}

const setRemoteWork = async (page) => {
    try {
        console.log('Set Remote Work');
        await delay(4000, 5000);
        if (await !page.$('button[aria-label="Remote filter. Clicking this button displays all Remote filter options."]')) {
            throw new Error('No Work Type Button Found');
        }
        await page.locator('button[aria-label="Remote filter. Clicking this button displays all Remote filter options."]').click();
        await delay();
        await page.locator('#f_WT-2').click();
        await delay();
        await page.locator('button.filter__submit-button[data-tracking-control-name="public_jobs_f_WT"]').click();
    } catch (error) {
        throw new Error('Error Setting Remote Work:', error);
    }
}

const setJobsLast24Hours = async (page) => {
    try {
        console.log('Set Last 24 Hour Jobs');
        await delay(4000, 5000);
        if (await !page.$('button[aria-label="Date posted filter. Any time filter is currently applied. Clicking this button displays all Date posted filter options."]')) {
            throw new Error('No Time Frame Button Found');
        }
        await page.locator('button[aria-label="Date posted filter. Any time filter is currently applied. Clicking this button displays all Date posted filter options."]').click();
        await delay();
        await page.locator('#f_TPR-3').click();
        await delay();
        await page.locator('button.filter__submit-button[data-tracking-control-name="public_jobs_f_TPR"]').click();
    } catch (error) {
        throw new Error('Error Setting Last 24 Hour Jobs:', error);
    }
}

const getData = async (page) => {
    console.log('Scraping');
    try {
        await delay(4000, 5000);
        if (await !page.$('section.two-pane-serp-page__results-list > ul.jobs-search__results-list > li')) {
            throw new Error('No Search Results Found');
        }
        const gotData = await page.evaluate(() => {
            const liElements = document.querySelectorAll('section.two-pane-serp-page__results-list > ul.jobs-search__results-list > li');
            const result = Array.from(liElements).map(li => {
                const card = li.querySelector('div.base-card');
                return {
                    title: card?.querySelector('h3.base-search-card__title')?.textContent.trim() || null,
                    company: card?.querySelector('h4.base-search-card__subtitle a')?.textContent.trim() || null,
                    location: card?.querySelector('span.job-search-card__location')?.textContent.trim() || null,
                    datePosted: card?.querySelector('time.job-search-card__listdate--new')?.getAttribute('datetime') || null,
                    jobURL: card?.querySelector('a.base-card__full-link')?.href || null,
                    companyLogo: card?.querySelector('img.artdeco-entity-image')?.src || null
                };
            });
            return result;
        });
        return gotData;
    } catch (error) {
        throw new Error('Error Getting Data:', error);
    }
}

const SaveToDBJobListing = async (data, searchTermId) => {
    const dataForDB = data.map(jobListing => {
        const { title, company, location, jobURL } = jobListing;

        return {
            updateOne: {
                filter: { jobURL: jobURL },
                update: {
                    $set: {
                        title,
                        company,
                        location,
                        jobURL
                    },
                    $addToSet: {
                        searchTerms: searchTermId
                    }
                },
                upsert: true
            }
        };
    });


    const result = await JobListing.bulkWrite(dataForDB);


}

const startScraping = async (job, country, searchTermId) => {
    let browser;
    try {
        // const { page, browser } = await initializeBrowserAndPage();
        // await goToURL(page);
        // await acceptCookies(page);
        // await insertJob(page, job);
        // await insertCountry(page, country);
        // await setRemoteWork(page);
        // await setJobsLast24Hours(page);
        // const data = await getData(page);
        // await SaveToDBJobListing(data, searchTermId);
        // await delay(10000, 20000);
        // await browser.close();


    } catch (error) {
        console.error('Error Scraping: ', error);
    }
};

//? Old stuff

// const divContent = await page.evaluate(() => {
//     const div = document.querySelector('#main-content');
//     return div ? div.innerHTML : 'Div not found';
// });

// fs.writeFile('divContent.html', divContent, 'utf8', (err) => {
//     if (err) {
//         console.error('Error writing file:', err);
//     } else {
//         console.log('File has been saved!');
//     }
// });


// try {
//     // Read the file content synchronously
//     const fileContent = fs.readFileSync('divContent.html', 'utf8');
//     // console.log('File content loaded into variable:', fileContent);
//     await page.setContent(fileContent);
//     // You can now use `fileContent` as needed
// } catch (err) {
//     console.error('Error reading file:', err);
// }



// const element = await page.locator('div.QS5gu.sy4vM').click();
// Target the div inside a button with specific text
// const element = await page.locator('//button//div[text()="Accept all"]').click();
// await page.locator('//button[.//div[contains(@class, "QS5gu") and contains(@class, "sy4vM")]]').click();

// await page.waitForSelector('input[value="Google Search"]');
// await page.click('input.lsb[value="I\'m Feeling Lucky"]');
// await delay(6000, 8000); // Random delay between 1-2 seconds

// await page.click('[aria-label="Stay signed out"]');

// const button = await page.$('button'); // Assuming buttons are in <button> tags
// if (button) {
//     const text = await page.evaluate(el => el.textContent.trim(), button);
//     if (text === 'Stay signed out') {
//         await button.click();
//     }
// }

// const button = await page.$('button'); // Assuming buttons are in <button> tags
// if (button) {
//     console.log('Button found');
//     const text = await page.evaluate(el => el.textContent.trim(), button);
//     console.log(text);
//     if (text === 'Stay signed out') {
//         await button.click();
//     }
// }




// await page.goto('https://www.linkedin.com/jobs/search', {
//     waitUntil: 'networkidle2', // Wait until the network is idle
// });





// console.log('Screenshot taken and browser closed');



// async isSelectorExists(selector: string) {
//     return await this._page.$(selector).catch(() => null) !== null;
//   }



//! Delay Methods

// await page.type('#input-field', 'Hello, world!', { delay: 100 }); // 100ms delay between keystrokes
// await page.keyboard.press('Enter', { delay: 50 }); // 50ms delay

// await page.mouse.click(100, 100, { delay: 100 });

// const moveMouseSmoothly = async (page, startX, startY, endX, endY, duration) => {
//     const steps = 50; // Number of intermediate steps
//     const delay = duration / steps; // Delay between each step
//     const xStep = (endX - startX) / steps;
//     const yStep = (endY - startY) / steps;

//     for (let i = 0; i < steps; i++) {
//         const x = startX + xStep * i;
//         const y = startY + yStep * i;
//         await page.mouse.move(x, y);
//         await new Promise(resolve => setTimeout(resolve, delay));
//     }

//     // Final move to ensure the cursor ends exactly at the destination
//     await page.mouse.move(endX, endY);
// };


// const simulateSmoothScroll = async (page, startY, endY, duration) => {
//     await page.evaluate((startY, endY, duration) => {
//         const start = startY;
//         const end = endY;
//         const startTime = Date.now();
//         const scroll = () => {
//             const currentTime = Date.now();
//             const elapsed = Math.min((currentTime - startTime) / duration, 1);
//             const currentY = start + (end - start) * elapsed;
//             window.scrollTo(0, currentY);
//             if (elapsed < 1) {
//                 requestAnimationFrame(scroll);
//             }
//         };
//         scroll();
//     }, startY, endY, duration);
// };

// await page.keyboard.type(char, { delay: randomDelay(50, 150) }); // Random delay between 50ms and 150ms


module.exports = startScraping;