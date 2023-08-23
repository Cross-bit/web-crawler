# Elementary queries

Contains functions calling "elementary" queries that are committed to database as atomic request(via single SQL query).<br>
Based on these queries more complex ones can be composed.<br>
No error handling is done here and is up to caller to handle them appropriately.<br>