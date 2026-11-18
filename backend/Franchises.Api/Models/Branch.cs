using System.ComponentModel.DataAnnotations;
namespace Franchises.Api.Models;
public class Branch
{
    public int Id { get; set; }
    [Required] public int FranchiseId { get; set; }
    [Required, StringLength(100, MinimumLength = 2)] public string Name { get; set; } = string.Empty;
    public Franchise? Franchise { get; set; }
    public List<Product> Products { get; set; } = [];
}
