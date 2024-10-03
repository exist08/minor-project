import React from 'react'
import './accounts.css'
import TeachersAcc from './TeachersAcc'
import StudentsAcc from './StudentsAcc'

function AccountsManager() {
    return (
        <section className='p-8 accounts-manager-container gap-4'>
            <TeachersAcc />
            <StudentsAcc />
        </section>
    )
}

export default AccountsManager