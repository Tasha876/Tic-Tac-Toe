export default ()=> {
    const query = window.location.search

    const params = new URLSearchParams(query)

    return params.get('level')
    
}