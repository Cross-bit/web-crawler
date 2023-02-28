# Elementary queries

Contains functions calling "elementary" queries, that are commited to database as atomic request(via single SQL query).<br>
Based on these queries more complex ones can be composed.<br>
No error handling is done here and is left for the caller to handle them appropriatly.<br>