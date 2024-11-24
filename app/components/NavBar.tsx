import { useContext } from "react";
import { AuthContext } from "../context/authorizationold";
import Link from 'next/link'
import "./NavBar.css"

const NavBar = () => {

    const authContext = useContext(AuthContext);

    if (!authContext) {
        // Handle the case where context is not provided
        return <div>Loading...</div>; // Or some fallback component
    }
    const { userEnrolled } = authContext;

    return (
        <div className="navBarContainer">
            Nav
            <div>
                <Link href="/joblisting/new" >
                    Job Listings new
                </Link>
            </div>
            <div>
                <Link href="/joblisting/seen">
                    Job Listings seen
                </Link>
            </div>
            <div>
                <Link href="/joblisting/starred">
                    Job Listings starred
                </Link>
            </div>
            <div>
                <Link href="/jobsearch">
                    Job Search
                </Link>
            </div>
            {userEnrolled ? (<div>
                <Link href="/account/user" >
                    User
                </Link>
            </div>) :
                <div>
                    <Link href="/account/enroll" >
                        Enroll
                    </Link>
                </div>}
        </div>
    )
}

export default NavBar