
declare @msiName CHAR(50) = '<Name of MSI>'
drop user @msiName
go

-- Create a user for the managed identity in the target database
CREATE USER [<Name of MSI>] FROM EXTERNAL PROVIDER;
GO

-- Grant the necessary permissions to the managed identity
-- Example: Grant db_datareader and db_datawriter roles
ALTER ROLE db_datareader ADD MEMBER [<Name of MSI>];
ALTER ROLE db_datawriter ADD MEMBER [<Name of MSI>];
GO