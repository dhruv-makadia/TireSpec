namespace TireSpec.Api.Contracts;

public sealed record TireData(string Brand, string Model, string TireSize, string DotCode, string DotYear, string LoadIndex, string SpeedRating);
public sealed record TireScanRequest(string? ImageDataUrl, TireData? ManualData);
public sealed record TireScanResponse(string? ImageDataUrl, string Brand, string Model, string TireSize, string DotCode, string DotYear, string LoadIndex, string SpeedRating);
public sealed record QuoteRequest(string Brand, string Model, string TireSize, string DotCode, string DotYear, string LoadIndex, string SpeedRating);
public sealed record TireQuote(string Id, string Name, string Price, string Details, string Warranty, string TireSize);
public sealed record QuoteResponse(IReadOnlyCollection<TireQuote> Recommendations);
public sealed record ContactRequest(string? Name, string PhoneNumber, string? Email);
public sealed record ContactResponse(string Status, string Message);
