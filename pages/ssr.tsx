import { GetServerSideProps, NextPage } from 'next'
import { supabase } from '../utils/supabase'
import { Layout } from '../components/Layout'
import { Notice, Task } from '../types/types'
import { useRouter } from 'next/router'
import React from 'react'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps = async () => {
	console.log('getServerSideProps/ssr involved')
	const { data: tasks } = await supabase
		.from('todos')
		.select('*')
		.order('created_at', { ascending: true })
	const { data: notices } = await supabase
		.from('notices')
		.select('*')
		.order('created_at', { ascending: true })
	return { props: { tasks, notices } }
}

type StaticProps = {
	tasks: Task[]
	notices: Notice[]
}

const Ssr: NextPage<StaticProps> = ({ tasks, notices }) => {
	const router = useRouter()
	return (
		<Layout title="SSR">
			<p className="mb-3  text-blue-500">SSR</p>
			<ul className="mb-3">
				{tasks.map((task) => {
					return (
						<li key={task.id}>
							<p className="text-lg font-extrabold">{task.title}</p>
						</li>
					)
				})}
			</ul>
			<ul className="mb-3">
				{notices.map((notice) => {
					return (
						<li key={notice.id}>
							<p className="text-lg font-extrabold">{notice.content}</p>
						</li>
					)
				})}
			</ul>
			<Link href="/ssg" prefetch={false} className="my-3 text-xs">
				Link to ssg
			</Link>
			<Link href="/isr" prefetch={false} className="my-3 text-xs">
				Link to isr
			</Link>
			<button className="mb-3 text-xs" onClick={() => router.push('/ssg')}>
				Route to ssg
			</button>
			<button className="mb-3 text-xs" onClick={() => router.push('/isr')}>
				Route to isr
			</button>
		</Layout>
	)
}

export default Ssr
