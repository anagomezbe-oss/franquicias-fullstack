using System.ComponentModel.DataAnnotations;
namespace Franchises.Api.DTOs;
public record CreateFranchiseRequest([Required, StringLength(100, MinimumLength = 2)] string Name);
public record CreateBranchRequest([Required] int FranchiseId, [Required, StringLength(100, MinimumLength = 2)] string Name);
public record CreateProductRequest([Required] int BranchId, [Required, StringLength(100, MinimumLength = 2)] string Name, [Range(0, int.MaxValue)] int Stock);
public record UpdateStockRequest([Range(0, int.MaxValue)] int Stock);
