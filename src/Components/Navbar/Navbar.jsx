import {useState } from 'react'
import {
  Dialog,
  DialogPanel,
  PopoverGroup,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import PlaneIcon from '../../assets/paperPlane.png';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Plane from "../../assets/plane.png"
import Person from "../../assets/person.png"
import { Statistic } from 'antd';
import CountUp from 'react-countup';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const getToken = localStorage.getItem("token");
  const navigate=useNavigate();
  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${getToken}`,
          "Content-Type": "application/json",
        }
      });
      if (response.data.status == 200) {
        toast.success('Logout successfully.');
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("userStatus");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error('Logout failed.');
    }
  };
  const formatter = (value) => <CountUp end={value} separator="," />;
  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex">
            <img className="h-8 w-auto" src={PlaneIcon} alt="" />
            <h1 className='font-sevillana text-2xl'>Fairylines</h1>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
          Who are we?
          </a>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Companys
          </a>
          {
            localStorage.getItem("token")&&localStorage.getItem("userStatus")==="Customer" ? (
             <a href="/profile" className="text-sm font-semibold leading-6 text-gray-900">
            Profile
          </a> 
            ) : ""
          }
          {
            localStorage.getItem("token")&&localStorage.getItem("userStatus")==="Company" ? (
             <a href="/add-flight" className="text-sm font-semibold leading-6 text-gray-900">
            Add Flight
          </a> 
            ) : ""
          }
          {
            localStorage.getItem("token")&&localStorage.getItem("userStatus")==="Company" ? (
             <a href="/flights" className="text-sm font-semibold leading-6 text-gray-900">
            Flights
          </a> 
            ) : ""
          }
        </PopoverGroup>
        {
          localStorage.getItem("token")&&localStorage.getItem("userStatus")=="Company" ? (
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <img src={Plane} className='w-7 mr-2'/>
              <Link to="/flights" className="text-sm font-semibold leading-6 text-gray-900">
                {localStorage.getItem("name")}
              </Link>
            </div>
          ) : ""
        }
        {
          localStorage.getItem("token")&&localStorage.getItem("userStatus")=="Customer" ? (
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <img src={Person} className='w-6 mr-2'/>
              <Link to="/profile" className="text-sm font-semibold leading-6 text-gray-900">
                {localStorage.getItem("name")}
              </Link>
            </div>
          ) : ""
        }
        {
          localStorage.getItem("token") ? (
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900" onClick={handleLogout}>
                Logout <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          ) : (
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
                Log in | Register <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          )
        }
      </nav>
      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="#" className="-m-1.5 p-1.5">
              <img
                className={PlaneIcon}
                alt=""
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {
                  localStorage.getItem("token")&&localStorage.getItem("userStatus")==="Customer" ? ( <a
                    href="/profile"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Profile
                  </a>):""
                }
                {
                  localStorage.getItem("token")&&localStorage.getItem("userStatus")==="Company" ? ( <a
                    href="/add-flight"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Add Flight
                  </a>):""
                }
                {
                  localStorage.getItem("token")&&localStorage.getItem("userStatus")==="Company" ? ( <a
                    href="/flights"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Flights
                  </a>):""
                }
               
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Companys
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Who are we?
                </a>
              </div>
              <div className="py-6">
                {
                  localStorage.getItem("token") ? (
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={handleLogout} >
                      Log out
                    </a>
                  ) : (
                    <a
                      href="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Log in | Register
                    </a>
                  )
                }
              </div>
            </div>
            <div className="mt-12">
                  <Statistic value={1128936} formatter={formatter} className='text-center'/>
                  <h3 className='font-sevillana text-3xl text-center'>users love Fairylines</h3>
              </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}