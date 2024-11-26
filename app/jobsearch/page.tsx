"use client";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SEARCH_TERMS } from "../graphql/queries/searchTerm";
import { CREATE_SEARCH_TERM, DELETE_SEARCH_TERM } from "../graphql/mutations/searchTerm";

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

  // GraphQL Queries and Mutations
  const { data: searchTermData, refetch } = useQuery(GET_SEARCH_TERMS);
  const [createSearchTerm] = useMutation(CREATE_SEARCH_TERM);
  const [deleteSearchTerm] = useMutation(DELETE_SEARCH_TERM);

  useEffect(() => {
    if (searchTermData) {
      setJobSearchTermList(searchTermData.searchTerms);
    }
  }, [searchTermData]);

  const handleJobTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setJobType(event.target.value);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(event.target.value);
  };

  const handleSaveEditName = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!inputJobSearchTerm || !inputLocation || !jobType) {
      console.log("Please fill in all fields");
      return;
    }

    try {
      await createSearchTerm({
        variables: {
          term: inputJobSearchTerm,
          location: inputLocation,
          jobType: jobType,
        },
      });
      setJobType("");
      setInputLocation("");
      setInputJobSearchTerm("");
      await refetch(); // Refresh data after mutation
    } catch (error) {
      console.error("Error creating search term:", error);
    }
  };

  const handleDelete = async (_id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      const { data } = await deleteSearchTerm({
        variables: { id: _id },
      });
      console.log("Deletion response:", data.deleteSearchTerm); // Should log "Search term deleted successfully"
      setJobSearchTermList((prev) => prev.filter((term) => term._id !== _id)); // Update local state
    } catch (error) {
      console.error("Error deleting search term:", error);
    }
  };



  return (
    <div>
      <h1>Job Search Terms</h1>
      <h2>Saved Search Terms</h2>
      <ul>
        {jobSearchTermList.map((term: JobSearchTermType) => (
          <li key={term._id}>
            {term.term} - {term.location} - {term.jobType}{" "}
            <button onClick={(event) => handleDelete(term._id, event)}>🚮</button>
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
