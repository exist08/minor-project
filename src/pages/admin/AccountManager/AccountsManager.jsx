import React from 'react'
import './accounts.css'
import TeachersAcc from './TeachersAcc'
import StudentsAcc from './StudentsAcc'
import useToast from '../../../Utils/UseToast'

function AccountsManager() {
    const {addToast,ToastContainer} = useToast()
    return (
        <section className='p-8 accounts-manager-container gap-4'>
            <TeachersAcc addToast={addToast} />
            <StudentsAcc addToast={addToast} />
            <ToastContainer />
        </section>
    )
}

export default AccountsManager