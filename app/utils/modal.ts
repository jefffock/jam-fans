export const openModal = (setIsModalOpen, event) => {
	event.preventDefault()
	setIsModalOpen(true)
}

export const closeModal = (setIsModalOpen) => {
	setIsModalOpen(false)
}
