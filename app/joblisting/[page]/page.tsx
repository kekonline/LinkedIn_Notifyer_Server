//rafce
"use client";

import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";
import DOMPurify from 'dompurify';
import axiosInstance from "../../services/axiosInstance"

interface JobListingProps {
  _id: string;
  page: string;
  company: string;
  title: string;
  description: string;
  jobURL: string;
  markAs: string;
}


const JobLinsting = () => {

  const params = useParams<{ page: string }>();
  const { page } = params;

  const [jobListingsList, setJobListingsList] = useState([]);

  const getJobListings = async () => {
    const responseJobListings = await axiosInstance.get("/api/job/" + page);
    // console.log("responseJobListings", responseJobListings.data)
    setJobListingsList(responseJobListings.data["jobListings"]);
  };

  useEffect(() => {
    getJobListings();
  }, [page])

  const handleMarkAs = async (event: React.MouseEvent<HTMLButtonElement>, _id: string, markAs: string) => {
    event.preventDefault();

    try {
      await axiosInstance.put(`api/job/id/${_id}`, {
        markAs
      });
      await getJobListings();
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div>
      <h1>Job Listings</h1>
      {jobListingsList.map((job: JobListingProps) => (
        <li key={job._id}>
          <h2> Company - {job.company}</h2>
          <br />
          <h2>  Title - {job.title}</h2>
          <br />
          Job Description - <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description) }} />
          <br />
          URL - <a href={job.jobURL}>Go To Job</a>
          <br />
          <div>
            <button onClick={(event) => handleMarkAs(event, job._id, "seen")}>Mark As Seen</button>
            <button onClick={(event) => handleMarkAs(event, job._id, "starred")}>Mark As Starred</button>
          </div>
          <br />
          <hr />
        </li>
      ))}
    </div>
  )
}

export default JobLinsting



// // pages/job-listing/[page].js
// "use client";

// import { useState } from "react";
// import DOMPurify from "dompurify";
// import axiosInstance from "../../services/axiosInstance";

// interface JobListingProps {
//   _id: string;
//   page: string;
//   company: string;
//   title: string;
//   description: string;
//   jobURL: string;
//   markAs: string;
// }

// interface JobListingPageProps {
//   jobListingsList: JobListingProps[];
//   page: string;
// }

// const JobListing = ({ jobListingsList: initialJobListingsList, page }: JobListingPageProps) => {
//   const [jobListingsList, setJobListingsList] = useState(initialJobListingsList);

//   const getJobListings = async () => {
//     const responseJobListings = await axiosInstance.get("/api/job/" + page);
//     setJobListingsList(responseJobListings.data["jobListings"]);
//   };

//   const handleMarkAs = async (event: React.MouseEvent<HTMLButtonElement>, _id: string, markAs: string) => {
//     event.preventDefault();

//     try {
//       await axiosInstance.put(`api/job/id/${_id}`, { markAs });
//       await getJobListings();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div>
//       <h1>Job Listings</h1>
//       {jobListingsList.map((job: JobListingProps) => (
//         <li key={job._id}>
//           <h2>Company - {job.company}</h2>
//           <br />
//           <h2>Title - {job.title}</h2>
//           <br />
//           Job Description - <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description) }} />
//           <br />
//           URL - <a href={job.jobURL}>Go To Job</a>
//           <br />
//           <div>
//             <button onClick={(event) => handleMarkAs(event, job._id, "seen")}>Mark As Seen</button>
//             <button onClick={(event) => handleMarkAs(event, job._id, "starred")}>Mark As Starred</button>
//           </div>
//           <br />
//           <hr />
//         </li>
//       ))}
//     </div>
//   );
// };

// export async function getServerSideProps(context : any) {
//   const { page } = context.params;

//   try {
//     const response = await axiosInstance.get(`/api/job/${page}`);
//     const jobListingsList = response.data["jobListings"];

//     return {
//       props: {
//         jobListingsList,
//         page,
//       },
//     };
//   } catch (error) {
//     console.error("Failed to fetch job listings:", error);
//     return {
//       props: {
//         jobListingsList: [],
//         page,
//       },
//     };
//   }
// }

// export default JobListing;
