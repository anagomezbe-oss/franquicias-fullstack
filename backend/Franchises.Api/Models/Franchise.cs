using System.ComponentModel.DataAnnotations;
namespace Franchises.Api.Models;
public class Franchise
{
    public int Id { get; set; }
    [Required, StringLength(100, MinimumLength = 2)] public string Name { get; set; } = string.Empty;
    public List<Branch> Branches { get; set; } = [];
}
