import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import type { RootState } from "../redux/store"
import { logout } from "../redux/authSlice"

function Account() {

    const dispatch = useDispatch()

    const username = useSelector((state: RootState) => state.auth.currentUser)

    const handleLogOut = () => {
        dispatch(logout())
    }

    return (
        <div className="w-full bg-primary-dark">
            <div className="w-full max-w-7xl px-6 mx-auto flex justify-end gap-6 py-2 text-primary-light">
                {username ? (
                    <>
                        <span>
                            Hello, {username.username}
                        </span>
                        <button type="button" onClick={handleLogOut} className="cursor-pointer">
                            LOGOUT
                        </button>
                    </>
                ) : (
                    <>
                        <Link to='/login' className="cursor-pointer hover:underline">
                            Sign in/Guest
                        </Link>
                        <Link to='/register' className="cursor-pointer hover:underline">
                            Create Account
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default Account