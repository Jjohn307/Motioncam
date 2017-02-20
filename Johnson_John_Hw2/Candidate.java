

public class Candidate{
	private String first_name;
	private String last_name;
	private String preferred_department;
	private int preference_order;
	private int written_score;
	private int programming_score;
	private double total_score;
		
	public Candidate()
	{
		
	}
	public String getFirstname()
	{
		return this.first_name;
	}
	public void setFirstname(String first_name)
	{
		this.first_name = first_name;
	}
	public String getLastname()
	{
		return this.last_name;
	}
	public void setLastname(String last_name)
	{
		this.last_name = last_name;
	}
	public String getDepartment()
	{
		return this.preferred_department;
	}
	public void setDepartment(String preferred_department)
	{
		this.preferred_department = preferred_department;
	}
	public int getOrder()
	{
		return this.preference_order;
	}
	public void setOrder(int order)
	{
		this.preference_order =order;
	}
	public int getWrittenscore()
	{
		return this.written_score;
	}
	public void setWrittenscore(int written_score)
	{
		this.written_score = written_score;
	}
	public int getProgrammingscore()
	{
		return this.programming_score;
	}
	public void setProgrammingscore(int programming_score)
	{
		this.programming_score = programming_score;
	}
	public double getTotalscore()
	{
		return this.total_score = .4 * this.written_score + .6 * this.programming_score; 
	}
}

