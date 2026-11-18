using System.ComponentModel.DataAnnotations;
namespace Franchises.Api.Models;
public class Product
{
    public int Id { get; set; }
    [Required] public int BranchId { get; set; }
    [Required, StringLength(100, MinimumLength = 2)] public string Name { get; set; } = string.Empty;
    [Range(0, int.MaxValue)] public int Stock { get; set; }
    public Branch? Branch { get; set; }
}
