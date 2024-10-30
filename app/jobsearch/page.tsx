"use client";
import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance"


function JobSearch() {

  interface JobSearchTermType {
    _id: string;
    term: string | null;
    location: string | null;
    jobType: string | null;
  }

  const [jobType, setJobType] = useState<string>('');
  const [inputLocation, setInputLocation] = useState<string>('');
  const [inputJobSearchTerm, setInputJobSearchTerm] = useState<string>('');
  const [jobSearchTermList, setJobSearchTermList] = useState<JobSearchTermType[]>([]);

  const handleJobTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setJobType(event.target.value);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(event.target.value);
  };

  const handleSaveEditName = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Validate not null and that values are not already in the array
    if (!inputJobSearchTerm || !inputLocation || !jobType) {
      console.log("Please fill in all fields");
      return;
    }

    try {
      await axiosInstance.post("/api/searchterm/", {
        term: inputJobSearchTerm,
        location: inputLocation,
        jobType: jobType,
      });
      await getSearchTerms();
      setJobType("")
      setInputLocation("")
      setInputJobSearchTerm("")
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (_id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      await axiosInstance.delete("/api/searchterm/" + _id);
      await getSearchTerms();
    } catch (error) {
      console.log(error);
    }
  };

  const getSearchTerms = async () => {
    try {
      const responseSearchTerms = await axiosInstance.get("/api/searchterm");
      console.log("responseSearchTerms", responseSearchTerms);
      setJobSearchTermList(responseSearchTerms.data.searchTerms);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSearchTerms();
  }, []);

  return (
    <div>
      <h1>Job Search Terms</h1>
      <h2>Saved Search Terms</h2>
      <ul>
        {jobSearchTermList.map((term: JobSearchTermType) => (
          <li key={term._id}>
            {term.term} - {term.location} - {term.jobType} <button onClick={(event) => handleDelete(term._id, event)}>🚮</button>
          </li>
        ))}
      </ul>
      <br />
      <br />
      <form>
        <div>
          <label htmlFor="inputSearchTerm">Search Term: </label>
          <input
            id="inputSearchTerm"
            type="text"
            value={inputJobSearchTerm}
            onChange={(event) => handleInputChange(event, setInputJobSearchTerm)}
          />
        </div>
        <div>
          <label htmlFor="inputLocation">Location: </label>
          <input
            id="inputLocation"
            type="text"
            value={inputLocation}
            onChange={(event) => handleInputChange(event, setInputLocation)}
          />
        </div>
        <div>
          <label htmlFor="dropdown">Select A Job Type: </label>
          <select id="dropdown" value={jobType} onChange={handleJobTypeChange}>
            <option value=""></option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>
        <div>
          <button onClick={handleSaveEditName}>Save</button>
        </div>
      </form>
    </div>
  );
}

export default JobSearch;
