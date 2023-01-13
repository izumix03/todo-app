import { useMutation, useQueryClient } from 'react-query'
import useStore from '../store'
import { EditedNotice, Notice } from '../types/types'
import { supabase } from '../utils/supabase'

export const useMutateNotice = () => {
	const queryClient = useQueryClient()
	const reset = useStore((state) => state.resetEditedNotice)

	const createNoticeMutation = useMutation(
		async (notice: Omit<Notice, 'id' | 'created_at'>) => {
			const { data, error } = await supabase.from('notices').insert(notice)
			if (error) throw new Error(error.message)
			return data
		},
		{
			onSuccess: (res) => {
				const previousTodos = queryClient.getQueryData<Notice[]>(['notices'])
				if (previousTodos) {
					queryClient.setQueryData(['todos'], [...previousTodos, res[0]])
				}
				reset()
			},
			onError: (err: any) => {
				alert(err.message)
				reset()
			},
		}
	)

	const updateNoticeMutation = useMutation(
		async (notice: EditedNotice) => {
			const { data, error } = await supabase
				.from('notices')
				.update({ content: notice.content })
				.eq('id', notice.id)
			if (error) throw new Error(error.message)
			return data
		},
		{
			onSuccess: (res, variables) => {
				const previousTodos = queryClient.getQueryData<Notice[]>(['notices'])
				if (previousTodos) {
					queryClient.setQueryData(
						['notices'],
						previousTodos.map((notice) =>
							notice.id === variables.id ? res[0] : notice
						)
					)
				}
				reset()
			},
			onError: (err: any) => {
				alert(err.message)
				reset()
			},
		}
	)

	const deleteNoticeMutation = useMutation(
		async (id: string) => {
			const { data, error } = await supabase
				.from('notice')
				.delete()
				.eq('id', id)
			if (error) throw new Error(error.message)
			return data
		},
		{
			onSuccess: (res, variables) => {
				const previousTodos = queryClient.getQueryData<Notice[]>(['notices'])
				if (previousTodos) {
					queryClient.setQueryData(
						['notices'],
						previousTodos.filter((notice) => notice.id !== variables)
					)
				}
				reset()
			},
			onError: (err: any) => {
				alert(err.message)
				reset()
			},
		}
	)

	return { deleteNoticeMutation, updateNoticeMutation, createNoticeMutation }
}
